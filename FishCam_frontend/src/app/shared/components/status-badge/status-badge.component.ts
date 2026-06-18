import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './status-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  
  // We receive the solde from the parent table
  solde = input.required<number>();

  // Calculate the CSS classes
  badgeClasses = computed(() => {
    const s = this.solde();
    if (s === 0) return 'bg-fc-green-light text-fc-green border-fc-green';
    if (s < 0 && s >= -5000) return 'bg-orange-100 text-fc-orange border-fc-orange';
    else return 'bg-fc-red-light text-fc-red border-fc-red ';
  });

  // Calculate the text to display
  badgeText = computed(() => {
    const s = this.solde();
    if (s === 0) return 'Soldé';
    // If in debt, we show the amount. (We will add a Currency Pipe later!)
    return `${s} FCFA`; 
  });
}