import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/stores/auth.store';
import { NotificationStore } from '../../features/notifications/stores/notification.store';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoissonnerieService } from '../../features/admin/services/poissonnerie.service';
import { PoissonnerieResponse } from '../../core/models/poissonnerie-response.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, DatePipe, FormsModule],
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly notificationStore = inject(NotificationStore);
  private readonly poissonnerieService = inject(PoissonnerieService);

  // --- INPUTS ---
  readonly pageTitle = input<string>('Tableau de bord');
  readonly unreadCount = input<number>(0);

  // --- OUTPUTS ---
  readonly mobileMenuClicked = output<void>();
  readonly searchClicked = output<void>();

  // --- UI STATE ---
  readonly isNotifOpen = signal<boolean>(false);
  
  // NOUVEAU : Signal pour stocker les vraies boutiques
  poissonneries = signal<PoissonnerieResponse[]>([]);

  ngOnInit() {
    // Si l'utilisateur est MULTI_POISSONNERIE, on charge la liste des boutiques
    if (this.authStore.isMultiPoissonnerie()) {
      this.poissonnerieService.getAll().subscribe({
        next: (res) => this.poissonneries.set(res.data.content),
        error: (err) => console.error('Erreur chargement poissonneries', err)
      });
    }
  }

  // --- COMPUTED ---
  readonly initials = computed(() => {
    const first = this.authStore.user()?.firstName ?? 'F';
    const last = this.authStore.user()?.lastName ?? 'C';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  });

  readonly recentNotifications = computed(() => this.notificationStore.recent());

  toggleNotifDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isNotifOpen.update(v => !v);
  }

  closeNotifDropdown() {
    this.isNotifOpen.set(false);
  }

  async onNotificationClick(id: number, read: boolean) {
    const userId = this.authStore.user()?.id;
    if (!userId) return;

    if (!read) {
      await this.notificationStore.markAsRead(id, userId);
    }
    this.closeNotifDropdown();
  }

  formatMessage(msg: string): string {
    return (msg ?? '').replaceAll('\\n', '\n');
  }

  @HostListener('document:click')
  onDocClick() {
    this.closeNotifDropdown();
  }

  onShopChange(id: number) {
    const selectedShop = this.poissonneries().find(p => p.id === id);
    if (selectedShop) {
      this.authStore.setActivePoissonnerie(id, selectedShop.name);
    }
  }

}