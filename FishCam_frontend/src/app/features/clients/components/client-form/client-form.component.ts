import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateClientRequest } from '../../models/client-request.model';
import { LucideAngularModule } from 'lucide-angular';
import { ClientResponse } from '../../../../core/models/compte-courant.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, LucideAngularModule, NgClass],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientFormComponent {

    private readonly fb = inject(FormBuilder);

    readonly isLoading = input<boolean>(false);
    readonly clientToEdit = input<ClientResponse | null>(null);

    readonly save = output<CreateClientRequest>();
    readonly cancel = output<void>();

    clientForm: FormGroup = this.fb.group({
       firstName:['', [Validators.required, Validators.maxLength(50)]],
       lastName:['', [Validators.required, Validators.maxLength(50)]],
       phone:['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
       cni: ['', [ Validators.maxLength(50)]],
       address: ['', [Validators.maxLength(255)]],
       quartier: ['', [Validators.required, Validators.maxLength(100)]],
       dateOfBirth: [''],
    });


    constructor() {
      effect(() => {
        const client = this.clientToEdit();
        if (client){
          this.clientForm.patchValue(client);
        }else{
          this.clientForm.reset();
        }
      })
    }

    isInvalid(fieldName: string): boolean {
      const field = this.clientForm.get(fieldName);
      return field ? (field.invalid && (field.dirty || field.touched)) : false;
    }

    onSubmit() {
      if (this.clientForm.valid) {
        this.save.emit(this.clientForm.value);
      } else {
        this.clientForm.markAllAsTouched();
      }
    }


}
