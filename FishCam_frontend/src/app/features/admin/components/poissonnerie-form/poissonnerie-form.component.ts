import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PoissonnerieResponse } from '../../../../core/models/poissonnerie-response.model';

@Component({
  selector: 'app-poissonnerie-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LucideAngularModule],
  templateUrl: './poissonnerie-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoissonnerieFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly poissonnerieToEdit = input<PoissonnerieResponse | null>(null);
  readonly isLoading = input<boolean>(false);
  
  readonly save = output<any>();
  readonly cancel = output<void>();

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    address: ['', [Validators.maxLength(255)]],
    phone: ['', [Validators.maxLength(20)]],
    loyer: [0, [Validators.min(0)]],
    fondDeCaisseDefaut: [10000, [Validators.min(0)]],
    pretActif: [false]
  });

  constructor() {
    effect(() => {
      const poissonnerie = this.poissonnerieToEdit();
      if (poissonnerie) {
        this.form.patchValue(poissonnerie);
      } else {
        this.form.reset({ loyer: 0, fondDeCaisseDefaut: 10000, pretActif: false });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}