import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DatePipe, NgClass } from '@angular/common';
import { RecapitulatifStore } from '../../stores/recapitulatif.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-recapitulatif-page',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DatePipe, NgClass, CurrencyFcfaPipe],
  templateUrl: './recapitulatif-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecapitulatifPageComponent implements OnInit {
  
  readonly store = inject(RecapitulatifStore);
  readonly authStore = inject(AuthStore);

  // Par défaut : du 1er du mois en cours à aujourd'hui
  readonly startDate = signal<string>('');
  readonly endDate = signal<string>('');

  ngOnInit(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Format YYYY-MM-DD
    this.startDate.set(firstDay.toISOString().split('T')[0]);
    this.endDate.set(today.toISOString().split('T')[0]);
  }

  generateReport() {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.loadRecapitulatif(poissonnerieId, this.startDate(), this.endDate());
    }
  }

  downloadPdf() {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.downloadPdf(poissonnerieId, this.startDate(), this.endDate());
    }
  }
}