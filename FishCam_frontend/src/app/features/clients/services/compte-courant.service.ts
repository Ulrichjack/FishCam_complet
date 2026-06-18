import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CompteCourantDetailResponse } from '../../../core/models/compte-courant.model';

@Injectable({ providedIn: 'root' })
export class CompteCourantService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comptes-courants`;

  // DIRECTIVE: Fais un appel GET vers /api/v1/comptes-courants/{compteId}
  // Retourne un Observable de ApiResponse<CompteCourantDetailResponse>
  getCompteCourantDetail(compteId: number) {
    // YOUR CODE HERE
    return this.http.get<ApiResponse<CompteCourantDetailResponse>>(`${this.apiUrl}/${compteId}`);
  }
}