import { BaseChartDirective } from 'ng2-charts';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { AuthStore } from '../../../../core/stores/auth.store';
import { StatistiquesStore } from '../../stores/statistiques.store';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { LucideAngularModule } from 'lucide-angular';
import { NgClass } from '@angular/common';
// YOUR CODE HE

@Component({
  selector: 'app-statistiques-page',
  standalone: true,
  imports: [CurrencyFcfaPipe, LucideAngularModule , BaseChartDirective, NgClass],
  templateUrl: './statistiques-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatistiquesPageComponent implements OnInit {

  readonly store = inject(StatistiquesStore);
  readonly authStore = inject(AuthStore);

  // Configuration de base pour le graphique Chart.js
  public barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };
  public barChartType = 'bar' as const;

  // DIRECTIVE: Create a computed signal 'chartData' that transforms 'store.statsPoissonnerie()?.revenueMensuel'
  // into the format expected by Chart.js:
  // Return an object: { labels: string[], datasets: [{ data: number[], label: string, backgroundColor: string, borderRadius: number }] }
  // Labels should be the dates, data should be the revenues.
  // Use '#185216' (fc-green) for backgroundColor and 4 for borderRadius.
  // YOUR CODE HERE
  readonly chartData = computed(() => {
    // ...
    const stats = this.store.statsPoissonnerie();
    if (!stats || !stats.revenueMensuel) {
      return { labels: [], datasets: [] };
    }

    const labels = stats.revenueMensuel.map(item => item.date);
    const data = stats.revenueMensuel.map(item => item.revenue);

    return {
      labels,
      datasets: [
        {
          data,
          label: 'Revenus Mensuels',
          backgroundColor: '#185216', // fc-green
          borderRadius: 4
        }
      ]
    };
  });

  ngOnInit(): void {
    // DIRECTIVE:
    // 1. Get activePoissonnerieId.
    // 2. Call store.loadStatsPoissonnerie(id)
    // 3. If authStore.isSuperAdmin() OR authStore.isPatron(), call store.loadStatsGlobales()
    // YOUR CODE HERE
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.loadStatsPoissonnerie(poissonnerieId);
    }

    if (this.authStore.isSuperAdmin() || this.authStore.isPatron()) {
      this.store.loadStatsGlobales();
    }
  }
}