import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ProduitResponse } from '../../../core/models/produit.model';
import { CreateLigneRequest, DernierPrixResponse } from '../../../core/models/facture-request.model';
import { ProductAutocompleteComponent } from '../product-autocomplete/product-autocomplete.component';
import { AchatJournalierService } from '../../../features/factures/services/achat-journalier.service';
import { CurrencyFcfaPipe } from '../../pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-ligne-form',
  standalone: true,
  imports: [ReactiveFormsModule, ProductAutocompleteComponent,  LucideAngularModule, CurrencyFcfaPipe],
  templateUrl: './ligne-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LigneFormComponent {

  private readonly fb = inject(FormBuilder);
  private readonly achatService = inject(AchatJournalierService);

  poissonnerieId = input.required<number>();

  ligneAdded = output<CreateLigneRequest & { produitNom: string }>();
  selectedProduitNom = signal<string>('');
  montantCalcule = signal<number>(0);
  isLoadingPrix = signal<boolean>(false);
  dernierPrix = signal<DernierPrixResponse | null>(null);

  ligneForm: FormGroup = this.fb.group({
    produitId: [null, Validators.required],
    quantiteCartons: [1, [Validators.required, Validators.min(1)]],
    prixUnitaireCarton: [null, [Validators.required, Validators.min(1)]],
    poidsKg: [null, [Validators.required, Validators.min(0.1)]],
    prixVenteKilo: [null, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    
    this.ligneForm.valueChanges.subscribe(values => {
      const quantite = values.quantiteCartons;
      const prix = values.prixUnitaireCarton;
      if(quantite && prix) {
        this.montantCalcule.set(quantite * prix);
      } else {
        this.montantCalcule.set(0);
      }
    });
  }

  async onProductSelected(produit: ProduitResponse) {
    this.ligneForm.patchValue({ produitId: produit.id });
    this.selectedProduitNom.set(produit.nom);
    this.isLoadingPrix.set(true);
    
    try {
      const response = await firstValueFrom(this.achatService.getDernierPrix(produit.id, this.poissonnerieId()));
      const dernierPrix = response.data; // <-- Ne pas oublier le .data !
      this.dernierPrix.set(dernierPrix);
      this.ligneForm.patchValue({ 
        prixUnitaireCarton: dernierPrix.montantCarton, // On utilise montantCarton à cause du DTO backend
        prixVenteKilo: dernierPrix.prixVenteKilo,
        poidsKg: dernierPrix.poidsParCarton // On auto-remplit aussi le poids !
      });
      
    } catch (error) {
      console.error("Impossible de récupérer le dernier prix", error);
    } finally {
      this.isLoadingPrix.set(false);
    }
  }

  onSubmit() {
    // DIRECTIVE: If form is valid, emit the value + selectedProduitNom, then reset the form (except produitId if you want)
    // YOUR CODE HERE
    if(this.ligneForm.valid) {
      const formValue = this.ligneForm.value;
      this.ligneAdded.emit({ 
        ...formValue, 
        produitNom: this.selectedProduitNom() 
      });
      this.ligneForm.reset({ quantiteCartons: 1 }); // Reset form but keep quantiteCartons at 1
      this.selectedProduitNom.set('');
      this.montantCalcule.set(0);
    }
  }
}