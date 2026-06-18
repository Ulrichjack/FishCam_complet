import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduitResponse } from '../../../../core/models/produit.model';
import { CreateProduitRequest } from '../../models/produit-request.model';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './produit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProduitFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly isLoading = input<boolean>(false);
  readonly produitToEdit = input<ProduitResponse | null>(null);

  readonly save = output<CreateProduitRequest>();
  readonly cancel = output<void>();

  // DIRECTIVE: Initialise le FormGroup avec nom (required), unite (required), poidsParCarton (required, min 0.1)
  // YOUR CODE HERE
  produitForm: FormGroup = this.fb.group({
    // ...
    nom: ['', Validators.required],
    unite: ['KG', Validators.required],
    poidsParCarton: [0.1, [Validators.required, Validators.min(0.1)]]
  });

  constructor() {
    // DIRECTIVE: Utilise un effect() pour écouter produitToEdit().
    // S'il y a un produit, patchValue. Sinon, reset le formulaire (avec unite: 'KG' par défaut).
    // YOUR CODE HERE
    effect(() => {
      const produit = this.produitToEdit();
      if (produit) {
        this.produitForm.patchValue(produit);
      } else {
        this.produitForm.reset({ unite: 'KG' });
      }
    });
  }

  onSubmit() {
    // DIRECTIVE: Si valide, émet la valeur du formulaire via 'save'. Sinon, markAllAsTouched().
    // YOUR CODE HERE
    if (this.produitForm.valid) {
      this.save.emit(this.produitForm.value);
    } else {
      this.produitForm.markAllAsTouched();
    }
  }
}