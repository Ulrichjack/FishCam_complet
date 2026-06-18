import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

// NOUVEAU : Interface pour un élément de l'historique
export interface BackupHistoryItem {
  dateExecution: string;
  type: string;
  success: boolean;
}

export interface BackupStatus {
  weeklyMissed: boolean;
  monthlyMissed: boolean;
  history: BackupHistoryItem[]; // NOUVEAU : Ajout de la liste
}

@Injectable({ providedIn: 'root' })
export class BackupService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/backup`;

  getStatus() {
    return this.http.get<ApiResponse<BackupStatus>>(`${this.apiUrl}/status`);
  }

  syncCloud() {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/sync-cloud`, {});
  }
}