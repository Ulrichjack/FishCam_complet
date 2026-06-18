// ─── SKELETON: src/app/features/admin/services/audit-log.service.ts ─────────

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { AuditLogResponse } from '../../../core/models/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/audit-logs`;

  // DIRECTIVE: Implement getAll(page: number = 0, size: number = 20)
  // Calls GET /api/v1/audit-logs?page=X&size=Y
  getAll(page: number = 0, size: number = 20) {
    // YOUR CODE HERE
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<AuditLogResponse>>>(this.apiUrl, { params });
  }
}