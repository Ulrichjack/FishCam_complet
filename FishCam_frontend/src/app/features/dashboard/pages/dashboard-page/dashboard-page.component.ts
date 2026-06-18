import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DashboardStore } from '../../stores/dashboard.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { StatsRowComponent } from '../../components/stats-row/stats-row.component';
import { AlertRibbonComponent } from '../../components/alert-ribbon/alert-ribbon.component';
import { NotificationPreviewComponent } from '../../components/notification-preview/notification-preview.component';
import { DailyReportCardComponent } from '../../components/daily-report-card/daily-report-card.component';
import { NotificationStore } from '../../../notifications/stores/notification.store';
import { CaissiereDashboardComponent } from '../../components/caissiere-dashboard/caissiere-dashboard.component';
import { GreetingHeaderComponent } from '../../../../shared/components/greeting-header/greeting-header.component';
import { EnregistreurDashboardComponent } from '../../components/enregistreur-dashboard/enregistreur-dashboard.component';

@Component({
  selector: 'app-dashboard',
  imports: [StatsRowComponent,AlertRibbonComponent,NotificationPreviewComponent,
            DailyReportCardComponent,CaissiereDashboardComponent, 
            GreetingHeaderComponent,EnregistreurDashboardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {

  readonly store = inject(DashboardStore);
  public readonly authStore = inject(AuthStore);
  readonly notificationStore = inject(NotificationStore);


  ngOnInit() {
     const poissonnerieId = this.authStore.activePoissonnerieId();
     const role = this.authStore.user()?.role;

    // Pass BOTH IDs to the store
    if (poissonnerieId && role) { 
      if(role === 'PATRON' || role === 'SUPER_ADMIN'){

         this.store.loadStats(poissonnerieId);

      } else{

        this.store.loadRoleSpecificData(poissonnerieId, role);
      }
      
    }
  
  }

}
