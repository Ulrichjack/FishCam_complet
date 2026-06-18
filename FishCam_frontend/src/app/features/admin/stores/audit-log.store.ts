// ─── SKELETON: src/app/features/admin/stores/audit-log.store.ts ─────────

import { inject, Injectable, signal } from "@angular/core";
import { AuditLogService } from "../services/audit-log.service";
import { firstValueFrom } from "rxjs";
import { PageResponse } from "../../../core/models/api-response.model";
import { AuditLogResponse } from "../../../core/models/audit-log.model";

@Injectable({ providedIn: 'root' })
export class AuditLogStore {
  private readonly auditService = inject(AuditLogService);

  private _logsPage = signal<PageResponse<AuditLogResponse> | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly logsPage = this._logsPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // DIRECTIVE: Implement loadLogs(page: number = 0)
  // 1. Set isLoading to true, error to null
  // 2. Call service.getAll(page)
  // 3. Set _logsPage with result.data
  // 4. Handle errors and finally block
  async loadLogs(page: number = 0) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.auditService.getAll(page));
      this._logsPage.set(response.data);
    } catch (error) {
      this._error.set('Erreur lors du chargement des logs');
    } finally {
      this._isLoading.set(false);
    }
  }
}