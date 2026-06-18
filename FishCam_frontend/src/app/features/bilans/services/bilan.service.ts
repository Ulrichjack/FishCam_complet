import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { BilanMensuelResponse, ComparaisonBoutiquesResponse } from '../../../core/models/bilan.model';

@Injectable({ providedIn: 'root' })
export class BilanService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/bilans`;

  // DIRECTIVE: Implement getBilanMensuel(poissonnerieId: number, mois: number, annee: number)
  // Calls GET /api/v1/bilans
  // Use HttpParams for poissonnerieId, mois, and annee
  getBilanMensuel(poissonnerieId: number, mois: number, annee: number) {
      return this.http.get<ApiResponse<BilanMensuelResponse>>(`${this.apiUrl}`, {
        params: new HttpParams()
          .set('poissonnerieId', poissonnerieId.toString())
          .set('mois', mois.toString())
          .set('annee', annee.toString())
      });
  }

  // DIRECTIVE: Implement compareBoutiques(mois: number, annee: number)
  // Calls GET /api/v1/bilans/comparaison
  // Use HttpParams for mois and annee
  compareBoutiques(mois: number, annee: number) {
    // YOUR CODE HERE
    return this.http.get<ApiResponse<ComparaisonBoutiquesResponse>>(`${this.apiUrl}/comparaison`, {
      params: new HttpParams()
        .set('mois', mois.toString())
        .set('annee', annee.toString())
    });
  }
}