// ─── SKELETON: src/app/features/admin/components/equipe-form/equipe-form.component.ts ─────────

import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserResponse } from '../../../../core/models/user.model';
import { LucideAngularModule } from 'lucide-angular';
import { PoissonnerieResponse } from '../../../../core/models/poissonnerie-response.model';

@Component({
  selector: 'app-equipe-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LucideAngularModule],
  templateUrl: './equipe-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipeFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly userToEdit = input<UserResponse | null>(null);
  readonly poissonneries = input<PoissonnerieResponse[]>([]); // Pour le select de la boutique
  readonly isLoading = input<boolean>(false);
  
  readonly save = output<any>();
  readonly cancel = output<void>();

  // DIRECTIVE: Create a FormGroup with:
  // firstName (required), lastName (required), phone (required), 
  // role (required), scope (required), defaultPoissonnerieId, password
  readonly form: FormGroup = this.fb.group({
    // YOUR CODE HERE
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    role: ['CAISSIERE', Validators.required],
    scope: ['MULTI_POISSONNERIE', Validators.required],
    defaultPoissonnerieId: [null],
    password: ['']
  });

  constructor() {
    effect(() => {
      const user = this.userToEdit();
      const passwordCtrl = this.form.get('password');

      if (user) {
        // MODE MODIFICATION
        this.form.patchValue(user);
        // DIRECTIVE: Remove validators from passwordCtrl and call updateValueAndValidity()
        // YOUR CODE HERE
        passwordCtrl?.clearValidators();
        passwordCtrl?.updateValueAndValidity();
      } else {
        // MODE CRÉATION
        this.form.reset({ role: 'CAISSIERE', scope: 'MULTI_POISSONNERIE' });
        // DIRECTIVE: Add Validators.required and Validators.minLength(6) to passwordCtrl and call updateValueAndValidity()
        // YOUR CODE HERE
        passwordCtrl?.setValidators([Validators.required, Validators.minLength(6)]);
        passwordCtrl?.updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    // DIRECTIVE: If valid, emit save. Else markAllAsTouched.
    // YOUR CODE HERE
    if(this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}