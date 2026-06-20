import { Component, ChangeDetectionStrategy, inject, effect, signal, HostListener, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { TopbarComponent } from '../../topbar/topbar.component';
import { AuthStore } from '../../../core/stores/auth.store';
import { NotificationStore } from '../../../features/notifications/stores/notification.store';
import { BackupStore } from '../../../features/admin/stores/backup.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, TopbarComponent, LucideAngularModule],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent implements OnInit {
  readonly notificationStore = inject(NotificationStore);
  readonly backupStore = inject(BackupStore);
  public readonly auth = inject(AuthStore);
  private router = inject(Router);

  readonly isSidebarOpen = signal(false);
  readonly isOnline = signal<boolean>(navigator.onLine);

  openSidebar() { this.isSidebarOpen.set(true); }
  closeSidebar() { this.isSidebarOpen.set(false); }

  @HostListener('window:online')
  onOnline() { this.isOnline.set(true); }

  @HostListener('window:offline')
  onOffline() { this.isOnline.set(false); }

  ngOnInit() {
    // MODIFIÉ : Tout le monde charge le statut des backups maintenant !
    this.backupStore.loadStatus();
  }

  constructor() {
    effect(() => {
      const userId = this.auth.user()?.id;
      if (!userId) return;
      this.notificationStore.refreshShell(userId);
    });

    // Effet magique pour l'Auto-Sauvegarde
    effect(() => {
      const status = this.backupStore.status();
      const online = this.isOnline();

      if (status && (status.weeklyMissed || status.monthlyMissed) && online && !this.backupStore.isLoading()) {
        console.log("🌐 Internet détecté et sauvegarde en retard : Lancement automatique !");
        this.backupStore.syncCloud();
      }
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
