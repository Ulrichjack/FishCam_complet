// ─── SKELETON: src/app/features/cloture/services/cloture.service.ts ─────────

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { ClotureJournaliereRequest, ClotureJournaliereResponse, PreparationClotureResponse } from '../../../core/models/cloture.model';

@Injectable({ providedIn: 'root' })
export class ClotureService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clotures`;


  preparerCloture(poissonnerieId: number, date: string) {
    return this.http.get<ApiResponse<PreparationClotureResponse>>(`${this.apiUrl}/preparer`, {
      params: {
        poissonnerieId: poissonnerieId.toString(),
        date: date
      }
    });
  }


  cloturer(request: ClotureJournaliereRequest) {
    return this.http.post<ApiResponse<ClotureJournaliereResponse>>(`${this.apiUrl}`, request);
  }


   getHistorique(poissonnerieId: number, page: number = 0, size: number = 10) {
    return this.http.get<ApiResponse<PageResponse<ClotureJournaliereResponse>>>(`${this.apiUrl}/historique`, {
      params: {
        poissonnerieId: poissonnerieId.toString(),
        page: page.toString(),
        size: size.toString()
      }
    });
  }
}
