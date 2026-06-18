import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardStore } from '../../stores/dashboard.store';
import { DebtorPillComponent } from '../../../../shared/components/debtor-pill/debtor-pill.component';

@Component({
  selector: 'app-alert-ribbon',
  imports: [DebtorPillComponent],
  templateUrl:'./alert-ribbon.component.html',
  styleUrl: './alert-ribbon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertRibbonComponent {
    public readonly store = inject(DashboardStore);
}
