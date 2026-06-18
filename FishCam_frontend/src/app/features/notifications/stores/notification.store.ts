import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { NotificationResponse, TypeNotification } from '../../../core/models/notification.model';
import { PageResponse } from '../../../core/models/api-response.model';
import { AuthStore } from '../../../core/stores/auth.store';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly api = inject(NotificationService);
  private readonly authStore = inject(AuthStore);

  // --- STATE ---
  private readonly _recent = signal<NotificationResponse[]>([]);
  private readonly _unreadCount = signal<number>(0);
  private readonly _page = signal<PageResponse<NotificationResponse> | null>(null);

  // --- READONLY ---
  readonly recent = this._recent.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();
  readonly page = this._page.asReadonly();

  // --- COMPUTED (Dashboard) ---
  readonly dailyReport = computed(() =>
    this.recent().find(n => n.type === 'RAPPORT_JOURNALIER') ?? null
  );

  readonly dailyReportMessage = computed(() =>
    this.dailyReport()?.message ?? "Aucun rapport disponible pour aujourd'hui."
  );

  readonly preview = computed(() => {
    const role = this.authStore.user()?.role;
    
    // Le Patron et le Super Admin ont la grande carte pour le rapport, 
    // donc on le cache dans leur petit preview.
    if (role === 'PATRON' || role === 'SUPER_ADMIN') {
      return this.recent().filter(n => n.type !== 'RAPPORT_JOURNALIER').slice(0, 3);
    }
    
    // La Caissière et l'Enregistreur n'ont pas la grande carte, 
    // ils doivent donc voir le rapport dans le preview !
    return this.recent().slice(0, 3);
  });
  
  // --- ACTIONS ---
  
  async refreshShell(userId: number) {
    const [recentRes, countRes] = await Promise.all([
      firstValueFrom(this.api.getRecent(userId, 10)), // 10 pour avoir une chance d'attraper le rapport
      firstValueFrom(this.api.getUnreadCount(userId)),
    ]);

    this._recent.set(recentRes.data ?? []);
    this._unreadCount.set(countRes.data?.count ?? 0);
  }

  /**
   * À appeler seulement sur la page "Notifications"
   */
  async loadPage(userId: number, page = 0, size = 20) {
    const res = await firstValueFrom(this.api.getNotificationsPage(userId, page, size));
    this._page.set(res.data ?? null);
  }

  async markAsRead(notificationId: number, userId: number) {
    await firstValueFrom(this.api.markAsRead(notificationId));
    await this.refreshShell(userId);
  }

  async markAllAsRead(userId: number) {
    await firstValueFrom(this.api.markAllAsRead(userId));
    await this.refreshShell(userId);
  }


  // 1. DIRECTIVE: Crée un signal privé _activeFilter initialisé à 'ALL'
  // (Il acceptera 'ALL' ou un TypeNotification)
  // YOUR CODE HERE
  private readonly _activeFilter = signal<'ALL' | TypeNotification>('ALL');

  // 2. DIRECTIVE: Expose-le en readonly
  // YOUR CODE HERE
  readonly activeFilter = this._activeFilter.asReadonly();

  // 3. DIRECTIVE: Crée un computed 'filteredNotifications'
  // Il regarde this._page()?.content. S'il n'y a rien, retourne [].
  // Si _activeFilter() === 'ALL', retourne tout le tableau.
  // Sinon, filtre le tableau où n.type === _activeFilter().
  // YOUR CODE HERE
  readonly filteredNotifications = computed(() => {
    const pageContent = this._page()?.content ?? [];
    const filter = this._activeFilter();

    if (filter === 'ALL') {
      return pageContent;
    }

    return pageContent.filter(n => n.type === filter);
  });

  // 4. DIRECTIVE: Crée une méthode setFilter(filter: TypeNotification | 'ALL')
  // qui met à jour _activeFilter
  // YOUR CODE HERE
  setFilter(filter: TypeNotification | 'ALL') {
    this._activeFilter.set(filter);
  }

}
