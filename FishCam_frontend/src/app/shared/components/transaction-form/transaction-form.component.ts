import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyFcfaPipe } from '../../pipes/currency-fcfa.pipe';

export type TransactionMode = 'emprunt' | 'remboursement' | 'depot' | 'retrait' | 'limite';


@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, NgClass, CurrencyFcfaPipe],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionFormComponent {

    private readonly fb = inject(FormBuilder); 

    //input
    readonly mode = input.required<TransactionMode>();
    readonly clientName = input.required<string>();
    readonly currentBalance = input.required<number | null >();
    readonly maxAmount = input<number | null>(null);
    
    //outputs
    readonly  save = output<{amount: number, notes: string}>();
    readonly cancel = output<void>();

    transactionForm: FormGroup = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      notes: ['', [Validators.maxLength(500)]]
    });

    onSubmit() {
      if (this.transactionForm.valid) {
        this.save.emit(this.transactionForm.value);
        this.transactionForm.reset();
      } else {
        this.transactionForm.markAllAsTouched();
      }

    }

    readonly buttonColorClass = computed(() => {
       switch (this.mode()) {
        case 'emprunt':
          return 'bg-fc-red hover:bg-fc-red-dark';
        case 'remboursement':
            return 'bg-fc-green hover:bg-fc-green-dark';
        case 'depot':
          return 'bg-fc-green hover:bg-fc-green-dark';
        case 'retrait':
          return 'bg-fc-orange hover:bg-orange-600';
        case 'limite':
          return 'bg-blue-600 hover:bg-blue-700';
        default:
          return 'bg-gray-500 hover:bg-gray-600';
       }
    })


    readonly buttonText = computed(() => {
      switch (this.mode()) {
        case 'emprunt': return "Enregistrer l'emprunt";
        case 'remboursement': return "Enregistrer le remboursement";
        case 'depot': return "Confirmer le dépôt";
        case 'retrait': return "Confirmer le retrait";
        case 'limite': return "Modifier la limite";
        default: return "Valider";
      }
    });

    readonly requiresDescription = computed(() => this.mode() === 'emprunt');

    constructor() {
      // This effect runs automatically whenever 'mode()' or 'maxAmount()' changes.
      effect(() => {
        const mode = this.mode();
        const max = this.maxAmount();
        const amountCtrl = this.transactionForm.get('amount');
        const notesCtrl = this.transactionForm.get('notes');

        // 1. Dynamic validation for AMOUNT
        if (max !== null) {
          // If there is a max amount, we enforce it
          amountCtrl?.setValidators([Validators.required, Validators.min(1), Validators.max(max)]);
        } else {
          // Otherwise, just required and min(1)
          amountCtrl?.setValidators([Validators.required, Validators.min(1)]);
        }
        amountCtrl?.updateValueAndValidity(); // CRITICAL: Tells Angular to re-check the form

        // 2. Dynamic validation for NOTES
        // DIRECTIVE: If this.requiresDescription() is true, set Validators.required and Validators.maxLength(500)
        // Otherwise, clear the validators (or just keep maxLength(500)).
        // Don't forget to call updateValueAndValidity() !
        if (this.requiresDescription()) {
          notesCtrl?.setValidators([Validators.required, Validators.maxLength(500)]);
        } else {
          notesCtrl?.setValidators([Validators.maxLength(500)]);
        }
        // YOUR CODE HERE
        notesCtrl?.updateValueAndValidity();
      });
    }

}
