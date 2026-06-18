import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { DashboardStore } from '../../stores/dashboard.store';

@Component({
  selector: 'app-stats-row',
  imports: [StatCardComponent],
  templateUrl: './stats-row.component.html',
  styleUrl: './stats-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class StatsRowComponent {
   public readonly store = inject(DashboardStore);
  



}
