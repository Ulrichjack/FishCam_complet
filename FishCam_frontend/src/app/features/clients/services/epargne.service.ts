import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
// Assure-toi d'importer EpargneDetailResponse depuis le bon fichier de modèle
import { EpargneDetailResponse } from '../../../core/models/epargne.model'; 

@Injectable({ providedIn: 'root' })
export class EpargneService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/epargnes`;

  // DIRECTIVE: Fais un appel GET vers /api/v1/epargnes/{epargneId}
  // Retourne un Observable de ApiResponse<EpargneDetailResponse>
  getEpargneDetail(epargneId: number) {
    // YOUR CODE HERE
    return this.http.get<ApiResponse<EpargneDetailResponse>>(`${this.apiUrl}/${epargneId}`);
  }
}