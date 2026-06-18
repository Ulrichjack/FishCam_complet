import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { RecapitulatifResponse } from '../../../core/models/recapitulatif.model';

@Injectable({ providedIn: 'root' })
export class RecapitulatifService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/recapitulatifs`;
  private readonly exportUrl = `${environment.apiUrl}/exports`;

  generateRecapitulatif(poissonnerieId: number, start: string, end: string) {
    const params = new HttpParams()
      .set('poissonnerieId', poissonnerieId.toString())
      .set('start', start)
      .set('end', end);
      
    return this.http.get<ApiResponse<RecapitulatifResponse>>(this.apiUrl, { params });
  }

  downloadPdf(poissonnerieId: number, start: string, end: string) {
    const params = new HttpParams()
      .set('poissonnerieId', poissonnerieId.toString())
      .set('start', start)
      .set('end', end);

    // ATTENTION: responseType: 'blob' est OBLIGATOIRE ici !
    return this.http.get(`${this.exportUrl}/recapitulatif/0/pdf`, { 
      params, 
      responseType: 'blob' 
    });
  }
}