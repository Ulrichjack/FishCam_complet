import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationStore } from '../../../notifications/stores/notification.store';

@Component({
  selector: 'app-notification-preview',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './notification-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPreviewComponent {

  readonly store = inject(NotificationStore);
  // Helper method to get the right color based on the type
  getColorForType(type: string): string {
  switch (type) {
    case 'COMPTE_COURANT_ALERTE': return 'text-red-700 bg-red-50 px-2 py-1 rounded-md';
    case 'COMPTE_SOLDE': return 'text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md';
    case 'RAPPORT_JOURNALIER': return 'text-blue-700 bg-blue-50 px-2 py-1 rounded-md';
    default: return 'text-gray-700 bg-gray-100 px-2 py-1 rounded-md';
  }
}
}
