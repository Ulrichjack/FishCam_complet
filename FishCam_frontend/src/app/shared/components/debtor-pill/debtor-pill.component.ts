import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {  NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';
import { CurrencyFcfaPipe } from '../../pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-debtor-pill',
  standalone: true,
  imports: [NgClass, LucideAngularModule, CurrencyFcfaPipe],
  templateUrl: './debtor-pill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorPillComponent {

  // We receive one debtor from the parent
  debtor = input.required<CompteCourantResponse>();

  // NEW: Determines the color of the status circle
  readonly statusCircleClass = computed(() => {
    const solde = this.debtor().solde;
    const limit = this.debtor().limiteCreditMax;

    if (solde < -limit) {
      return 'bg-fc-red'; // Critical
    } else if (solde <= -5000) {
      return 'bg-fc-red'; // High
    } else {
      return 'bg-fc-yellow'; // Warning
    }
  });

  // We calculate the background color dynamically based on the debt amount!
  readonly pillBackgroundClass = computed(() => {
    const solde = this.debtor().solde;
    const limit = this.debtor().limiteCreditMax;

    if (solde < -limit) {
      // BEYOND LIMIT: Light Red + Pulse animation
      return 'bg-fc-red-light text-fc-red-dark animate-pulse';
    } else if (solde <= -5000) {
      // TIER 2: Light Red
      return 'bg-fc-red-light text-fc-red-dark';
    } else {
      // TIER 1: Light Yellow
      return 'bg-fc-yellow-light text-fc-yellow-dark';
    }
  });
}
