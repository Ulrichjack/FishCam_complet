import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { NotificationResponse } from '../../../core/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  getNotificationsPage(userId: number, page = 0, size = 20) {
    const safeSize = size > 0 ? size : 20;
    return this.http.get<ApiResponse<PageResponse<NotificationResponse>>>(
      `${this.baseUrl}/user/${userId}/page?page=${page}&size=${safeSize}`
    );
  }

  getRecent(userId: number, limit = 5) {
    return this.http.get<ApiResponse<NotificationResponse[]>>(
      `${this.baseUrl}/user/${userId}/recent?limit=${limit}`
    );
  }

  getUnreadCount(userId: number) {
    return this.http.get<ApiResponse<{ count: number }>>(
      `${this.baseUrl}/user/${userId}/unread-count`
    );
  }

  markAsRead(notificationId: number) {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/${notificationId}/mark-as-read`,
      {}
    );
  }

  markAllAsRead(userId: number) {
    return this.http.put<ApiResponse<{ updated: number }>>(
      `${this.baseUrl}/user/${userId}/mark-all-as-read`,
      {}
    );
  }
}
