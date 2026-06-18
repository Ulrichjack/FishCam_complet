// ─── SKELETON: src/app/features/fournisseurs/components/fournisseur-form/fournisseur-form.component.ts ─────────

import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
// DIRECTIVE: Import FournisseurResponse

@Component({
  selector: 'app-fournisseur-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LucideAngularModule],
  templateUrl: './fournisseur-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FournisseurFormComponent {
  private readonly fb = inject(FormBuilder);

  // --- INPUTS & OUTPUTS ---
  readonly fournisseurToEdit = input<any | null>(null); // Replace 'any' with FournisseurResponse
  readonly isLoading = input<boolean>(false);
  
  readonly save = output<{ nom: string; ville: string; telephone: string }>();
  readonly cancel = output<void>();

  // --- FORM ---
  // DIRECTIVE: Create a FormGroup with nom (required, max 50), ville (required, max 50), telephone (max 10)
  readonly form: FormGroup = this.fb.group({
    // YOUR CODE HERE
    nom: ['', [Validators.required, Validators.maxLength(50)]],
    ville: ['', [Validators.required, Validators.maxLength(50)]],
    telephone: ['', [Validators.maxLength(10)]]
  });

  constructor() {
    // DIRECTIVE: Use effect() to watch fournisseurToEdit()
    // If it has a value, use this.form.patchValue(...) to fill the form
    // If it is null, use this.form.reset()
    // YOUR CODE HERE
    effect(() => {
      const fournisseur = this.fournisseurToEdit();
      if (fournisseur) {
        this.form.patchValue(fournisseur);
      } else {
        this.form.reset();
      }
    });
  }

  onSubmit() {
    // DIRECTIVE: If form is valid, emit save with form.value. Otherwise markAllAsTouched()
    // YOUR CODE HERE
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}