import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FacturePreviewComponent } from '../facture-preview/facture-preview.component';

import { AchatJournalierService } from '../../services/achat-journalier.service';
import { AuthStore } from '../../../../core/stores/auth.store';
import { firstValueFrom } from 'rxjs';
import { LigneFormComponent } from '../../../../shared/components/ligne-form/ligne-form.component';
import { CreateLigneRequest } from '../../../../core/models/facture-request.model';
import { FournisseurService } from '../../services/fournisseur.service';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// Local interface for the state of lines before saving to DB
export interface LigneFactureState extends CreateLigneRequest {
  produitNom: string;
  montantCarton: number;
  montantVentePrev: number;
}

@Component({
  selector: 'app-facture-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, 
    FacturePreviewComponent, LigneFormComponent, DecimalPipe],
  templateUrl: './facture-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FactureFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly achatService = inject(AchatJournalierService);
  public readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly fournisseurService = inject(FournisseurService);
  fournisseurs = signal<any[]>([]);

  isLoading = signal<boolean>(false);

  // Form for the Header (Date, Fournisseur, Livreur)
  factureForm: FormGroup = this.fb.group({
    dateAchat: [new Date().toISOString().substring(0, 10), Validators.required],
    fournisseurId: [null, Validators.required],
    livreurId: [null]
  });

  formValues = toSignal(this.factureForm.valueChanges, { initialValue: this.factureForm.value });
  // State: List of lines added to the invoice
  lignes = signal<LigneFactureState[]>([]);
  totalAchat = computed(() => this.lignes().reduce((sum, ligne) => sum + ligne.montantCarton, 0));
  totalVente = computed(() => this.lignes().reduce((sum, ligne) => sum + ligne.montantVentePrev, 0));
  benefice = computed(() => this.totalVente() - this.totalAchat());
  selectedFournisseurNom = computed(() => {
    const id = this.formValues().fournisseurId;
    return this.fournisseurs().find(f => f.id === id)?.nom ?? '...';
  });

  // DIRECTIVE: Method called when LigneFormComponent emits a new line
  onLigneAdded(ligneData: CreateLigneRequest & { produitNom: string }) {
    const montantCarton = ligneData.quantiteCartons * ligneData.prixUnitaireCarton;
    const montantVentePrev = ligneData.poidsKg * ligneData.prixVenteKilo;

    const newLine: LigneFactureState = {
      ...ligneData,
      montantCarton,
      montantVentePrev
    };

    this.lignes.update(lines => [...lines, newLine]);
  }

  // DIRECTIVE: Method to remove a line from the list
  removeLigne(index: number) {
    // Update the lignes() signal by removing the item at the given index
    // YOUR CODE HERE
    this.lignes.update(lines => lines.filter((_, i) => i !== index));

  }

  async onSubmit() {
    if (this.factureForm.invalid || this.lignes().length === 0) return;
    
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (!poissonnerieId) return;

    this.isLoading.set(true);

    try {
      // 1. Create the Facture header
      const factureRequest = {
        poissonnerieId: poissonnerieId,
        fournisseurId: this.factureForm.value.fournisseurId,
        dateAchat: this.factureForm.value.dateAchat
      };
      
      const factureResponse = await firstValueFrom(this.achatService.createFacture(factureRequest));
      const factureId = factureResponse.data.id;
      for (const ligne of this.lignes()) {
        const ligneRequest = {
          produitId: ligne.produitId,
          quantiteCartons: ligne.quantiteCartons,
          prixUnitaireCarton: ligne.prixUnitaireCarton,
          poidsKg: ligne.poidsKg,
          prixVenteKilo: ligne.prixVenteKilo
        };
        await firstValueFrom(this.achatService.addLigne(factureId, ligneRequest));
      } 

      // 3. Navigate back to the list
      this.router.navigate(['/factures']);

    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la facture", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnInit() {
    this.fournisseurService.getAll().subscribe(res => this.fournisseurs.set(res.data));
  }

}