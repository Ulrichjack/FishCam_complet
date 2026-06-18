import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CompteCourantResponse } from '../../../../core/models/compte-courant.model';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-debtor-card',
  standalone: true,
  imports: [CurrencyFcfaPipe, LucideAngularModule, RouterLink, DecimalPipe],
  templateUrl: './debtor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorCardComponent {
  
  // DIRECTIVE: Declare a required input named 'compte' of type CompteCourantResponse
  // YOUR CODE HERE
  readonly compte = input.required<CompteCourantResponse>();
  readonly reimburseClicked = output<number>();

  // DIRECTIVE: Declare an output named 'reimburseClicked' that emits the compte.id (number)
  // YOUR CODE HERE

  // --- COMPUTED ---
  // DIRECTIVE: Calculate the progress percentage of the debt.
  // Formula: (Math.abs(solde) / limiteCreditMax) * 100
  // Make sure it doesn't exceed 100%.
  readonly progressPercentage = computed(() => {
    // YOUR CODE HERE
    const { solde, limiteCreditMax } = this.compte();
    const percentage = (Math.abs(solde) / limiteCreditMax) * 100;
    return Math.min(percentage, 100);
  });

  // DIRECTIVE: Determine if the debt is critical (progress >= 90%)
  // Returns boolean
  readonly isCritical = computed(() => {
    // YOUR CODE HERE
    if (this.compte().limiteCreditMax === 0) {
      return false; // Avoid division by zero, treat as non-critical
    }
    return this.progressPercentage() >= 90;
  });
}