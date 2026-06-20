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

  // NOUVEAU : Variable pour éviter la boucle infinie
  private lastAutoSyncAttempt = 0;

  openSidebar() { this.isSidebarOpen.set(true); }
  closeSidebar() { this.isSidebarOpen.set(false); }

  @HostListener('window:online')
  onOnline() { this.isOnline.set(true); }

  @HostListener('window:offline')
  onOffline() { this.isOnline.set(false); }

  ngOnInit() {
    // Tout le monde charge le statut des backups au démarrage
    this.backupStore.loadStatus();
  }

  constructor() {
    // Effet pour les notifications
    effect(() => {
      const userId = this.auth.user()?.id;
      if (!userId) return;
      this.notificationStore.refreshShell(userId);
    });

    // Effet magique pour l'Auto-Sauvegarde avec délai de 5 minutes
    effect(() => {
      const status = this.backupStore.status();
      const online = this.isOnline();

      if (status && (status.weeklyMissed || status.monthlyMissed) && online && !this.backupStore.isLoading()) {
        
        const now = Date.now();
        // On vérifie si ça fait plus de 5 minutes (300 000 ms) depuis la dernière tentative
        if (now - this.lastAutoSyncAttempt > 300000) {
          console.log("🌐 Tentative d'auto-sauvegarde...");
          this.lastAutoSyncAttempt = now; // On enregistre l'heure de la tentative
          this.backupStore.syncCloud(true); // true = mode silencieux
        }
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