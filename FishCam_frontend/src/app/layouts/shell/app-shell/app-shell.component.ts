import { Component, ChangeDetectionStrategy, inject,  effect, signal } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { TopbarComponent } from '../../topbar/topbar.component';
import { AuthStore } from '../../../core/stores/auth.store';
import { NotificationStore } from '../../../features/notifications/stores/notification.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, TopbarComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent  {
  readonly notificationStore = inject(NotificationStore);
  private readonly auth = inject(AuthStore);
  private router = inject(Router);
  readonly isSidebarOpen = signal(false);


  openSidebar() { this.isSidebarOpen.set(true); }
  closeSidebar() { this.isSidebarOpen.set(false); }

  constructor() {
    effect(() => {
      const userId = this.auth.user()?.id;
      if (!userId) return;
      this.notificationStore.refreshShell(userId);
    });
  }

  readonly currentTitle = toSignal(
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map(() => {
        const url = this.router.url;
        if (url.includes('/clients')) return 'Clients';
        if (url.includes('/factures')) return 'Factures';
        if (url.includes('/transactions')) return 'Transactions';
        if (url.includes('/dettes')) return 'Comptes en dette';
        if (url.includes('/livreurs')) return 'Livreurs';
        if (url.includes('/produits')) return 'Produits';
        if (url.includes('/fournisseurs')) return 'Fournisseurs';
        if (url.includes('/notifications')) return 'Notifications';
        if (url.includes('/poissonneries')) return 'Poissonneries';
        if (url.includes('/equipe')) return 'Équipe';
        if (url.includes('/audit')) return 'Audit';
        if (url.includes('/bilans')) return 'Bilans';
        if (url.includes('/statistiques')) return 'Statistiques';
        if (url.includes('/cloture')) return 'Clôture de caisse';
        if (url.includes('/backup')) return 'Sauvegarde';
        return 'Tableau de bord';
      })
    ),
    { initialValue: 'Tableau de bord' }
  );


}
