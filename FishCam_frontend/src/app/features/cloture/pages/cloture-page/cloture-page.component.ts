// ─── SKELETON: src/app/features/cloture/pages/cloture-page/cloture-page.component.ts ─────────

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ClotureStore } from '../../stores/cloture.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cloture-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    DatePipe, 
    CurrencyFcfaPipe, 
    LucideAngularModule,
    ConfirmDialogComponent,
    RouterLink
  ],
  templateUrl: './cloture-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloturePageComponent implements OnInit {
  
  readonly store = inject(ClotureStore);
  readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  // --- STATE SIGNALS ---
  readonly selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  readonly isConfirmOpen = signal(false);

  // --- FORM ---
  readonly clotureForm: FormGroup = this.fb.group({
    argentCaisse: [null, [Validators.required, Validators.min(0)]],
    fondDeCaisse: [null, [Validators.required, Validators.min(0)]],
    transport: [0, [Validators.min(0)]],
    ration: [0, [Validators.min(0)]],
    autresFrais: [0, [Validators.min(0)]],
    descriptionAutres: ['']
  });

  // DIRECTIVE: 1. Convert form.valueChanges to a signal using toSignal()
  // YOUR CODE HERE
  readonly formValues = toSignal(this.clotureForm.valueChanges, { initialValue: this.clotureForm.value });

  // --- COMPUTED ---
  // DIRECTIVE: 2. Calculate "venteRealisee" = argentCaisse - fondDeCaisse
  // Use this.formValues() to get the current values. If null/undefined, use 0.
  // YOUR CODE HERE
  readonly venteRealisee = computed(() => {
    const { argentCaisse, fondDeCaisse } = this.formValues();
    return (argentCaisse || 0) - (fondDeCaisse || 0);
  });

  // DIRECTIVE: 3. Calculate "ecart" = venteRealisee - totalVentePrevisible
  // Get totalVentePrevisible from this.store.preparation()
  // YOUR CODE HERE
  readonly ecart = computed(() => {
    const { argentCaisse, fondDeCaisse, transport, ration, autresFrais } = this.formValues();
    const preparation = this.store.preparation();
    
    const totalVentePrevisible = preparation ? preparation.totalVentePrevisible : 0;
    // 🟢 CORRECTION DU BUG : On récupère les dettes et remboursements
    const dettes = preparation ? preparation.montantDettesJour : 0;
    const remboursements = preparation ? preparation.montantRembourseJour : 0;

    // 1. Calculer le total des dépenses
    const totalDepenses = (transport || 0) + (ration || 0) + (autresFrais || 0);
    
    // 2. 🟢 CORRECTION DU BUG : Calculer combien d'argent il DEVRAIT y avoir dans le tiroir
    const caisseTheorique = (fondDeCaisse || 0) + totalVentePrevisible - dettes + remboursements - totalDepenses;

    // 3. L'écart est la différence entre le Réel et le Théorique
    return (argentCaisse || 0) - caisseTheorique;
  });

  // Ajoute ceci juste en dessous de "readonly ecart = computed(...)"
  readonly isAlreadyClosed = computed(() => {
    const date = this.selectedDate(); // ex: "2026-05-08"
    return this.store.historique().some(h => h.date.startsWith(date));
  });

  constructor() {
    // DIRECTIVE: 4. Use an effect to auto-fill "fondDeCaisse" when store.preparation() loads
    // If store.preparation() has data, patch the 'fondDeCaisse' form control with preparation.fondDeCaisseDefaut
    // YOUR CODE HERE
    effect(() => {
      const preparation = this.store.preparation();
      if (preparation) {
        this.clotureForm.patchValue({ fondDeCaisse: preparation.fondDeCaisseDefaut }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.loadPageData(poissonnerieId, this.selectedDate()); 
    }
  }

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedDate.set(target.value);
    this.loadData();
  }

  openConfirm(): void {
    if (this.clotureForm.valid) {
      this.isConfirmOpen.set(true);
    } else {
      this.clotureForm.markAllAsTouched();
    }
  }

  async submitCloture() {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (!poissonnerieId || this.clotureForm.invalid) return;

    // DIRECTIVE: 5. Call this.store.submitCloture(...) with the form values + date + poissonnerieId
    // Then close the confirm dialog and reset the form (keep fondDeCaisse)
    // YOUR CODE HERE
    const formValues = this.clotureForm.value;
    const request = {
      poissonnerieId,
      date: this.selectedDate(),
      argentCaisse: formValues.argentCaisse,
      fondDeCaisse: formValues.fondDeCaisse,
      transport: formValues.transport,
      ration: formValues.ration,
      autresFrais: formValues.autresFrais,
      descriptionAutres: formValues.descriptionAutres
    };
    await this.store.submitCloture(request);
    this.isConfirmOpen.set(false);
    // Reset form but keep fondDeCaisse
    this.clotureForm.reset({ fondDeCaisse: formValues.fondDeCaisse });  
  }
}