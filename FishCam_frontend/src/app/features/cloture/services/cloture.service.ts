// ─── SKELETON: src/app/features/cloture/services/cloture.service.ts ─────────

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ClotureJournaliereRequest, ClotureJournaliereResponse, PreparationClotureResponse } from '../../../core/models/cloture.model';

@Injectable({ providedIn: 'root' })
export class ClotureService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clotures`;

  // DIRECTIVE: Implement preparerCloture(poissonnerieId: number, date: string)
  // Calls GET /api/v1/clotures/preparer?poissonnerieId=X&date=Y
  preparerCloture(poissonnerieId: number, date: string) {
    // YOUR CODE HERE
    return this.http.get<ApiResponse<PreparationClotureResponse>>(`${this.apiUrl}/preparer`, {
      params: {
        poissonnerieId: poissonnerieId.toString(),
        date: date
      }
    });
  }

  // DIRECTIVE: Implement cloturer(request: ClotureJournaliereRequest)
  // Calls POST /api/v1/clotures
  cloturer(request: ClotureJournaliereRequest) {
    // YOUR CODE HERE
    return this.http.post<ApiResponse<ClotureJournaliereResponse>>(`${this.apiUrl}`, request);  
  }

  // DIRECTIVE: Implement getHistorique(poissonnerieId: number)
  // Calls GET /api/v1/clotures/historique?poissonnerieId=X
  getHistorique(poissonnerieId: number) {
    return this.http.get<ApiResponse<ClotureJournaliereResponse[]>>(`${this.apiUrl}/historique`, {
      params: {
        poissonnerieId: poissonnerieId.toString()
      }
    });
  }
}