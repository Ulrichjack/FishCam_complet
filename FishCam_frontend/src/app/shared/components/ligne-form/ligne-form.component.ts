import { ChangeDetectionStrategy, Component, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ProduitResponse } from '../../../core/models/produit.model';
import { CreateLigneRequest, DernierPrixResponse } from '../../../core/models/facture-request.model';
import { ProductAutocompleteComponent } from '../product-autocomplete/product-autocomplete.component';
import { AchatJournalierService } from '../../../features/factures/services/achat-journalier.service';
import { CurrencyFcfaPipe } from '../../pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-ligne-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProductAutocompleteComponent,
    LucideAngularModule,
    CurrencyFcfaPipe
  ],
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
  poidsUnitaireCarton = signal<number>(0);
  @ViewChild(ProductAutocompleteComponent) autocompleteComponent!: ProductAutocompleteComponent;

  ligneForm: FormGroup = this.fb.group({
    produitId: [null, Validators.required],
    quantiteCartons: [1, [Validators.required, Validators.min(1)]],
    prixUnitaireCarton: [null, [Validators.required, Validators.min(1)]],
    poidsKg: [null, [Validators.required, Validators.min(0.1)]],
    prixVenteKilo: [null, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    // Écoute les changements globaux pour le montant total
    this.ligneForm.valueChanges.subscribe(values => {
      const quantite = values.quantiteCartons || 0;
      const prix = values.prixUnitaireCarton || 0;
      this.montantCalcule.set(quantite * prix);
    });

    // NOUVEAU : Écoute SPÉCIFIQUEMENT les changements de quantité pour recalculer le poids total
    this.ligneForm.get('quantiteCartons')?.valueChanges.subscribe(qty => {
      const unitWeight = this.poidsUnitaireCarton();
      if (unitWeight > 0 && qty) {
        // On met à jour le champ Poids Total sans déclencher une boucle infinie d'événements
        this.ligneForm.patchValue({ poidsKg: qty * unitWeight }, { emitEvent: false });
      }
    });
  }

  async onProductSelected(produit: ProduitResponse) {
    this.ligneForm.patchValue({ produitId: produit.id });
    this.selectedProduitNom.set(produit.nom);

    // NOUVEAU : On sauvegarde le poids d'un carton
    this.poidsUnitaireCarton.set(produit.poidsParCarton);

    this.isLoadingPrix.set(true);

    try {
      const response = await firstValueFrom(this.achatService.getDernierPrix(produit.id, this.poissonnerieId()));
      const dernierPrix = response.data;
      this.dernierPrix.set(dernierPrix);

      const currentQty = this.ligneForm.value.quantiteCartons || 1;

      this.ligneForm.patchValue({
        prixUnitaireCarton: dernierPrix.prixUnitaireCarton,
        prixVenteKilo: dernierPrix.prixVenteKilo,
        // NOUVEAU : On calcule le poids total immédiatement
        poidsKg: produit.poidsParCarton * currentQty
      });

    } catch (error) {
      // Si le produit n'a jamais été acheté, on remplit au moins le poids
      const currentQty = this.ligneForm.value.quantiteCartons || 1;
      this.ligneForm.patchValue({
        poidsKg: produit.poidsParCarton * currentQty
      });
    } finally {
      this.isLoadingPrix.set(false);
    }
  }

  onSubmit() {
    if(this.ligneForm.valid) {
      const formValue = this.ligneForm.value;
      this.ligneAdded.emit({
        ...formValue,
        produitNom: this.selectedProduitNom()
      });
      this.ligneForm.reset({ quantiteCartons: 1 });
      this.selectedProduitNom.set('');
      this.montantCalcule.set(0);
      this.poidsUnitaireCarton.set(0);
      
      // 🟢 NOUVEAU : On vide le texte de la barre de recherche !
      if (this.autocompleteComponent) {
        this.autocompleteComponent.searchQuery.set('');
      }
    }
  }
}
