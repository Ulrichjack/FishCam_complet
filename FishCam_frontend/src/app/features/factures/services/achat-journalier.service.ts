import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CreateLigneRequest, DernierPrixResponse, LigneAchatResponse } from '../../../core/models/facture-request.model';
import { CreateFactureRequest,  FactureDetailResponse,  FactureResponse } from '../../../core/models/facture.model';

@Injectable({
  providedIn: 'root',
})
export class AchatJournalierService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/factures`;

  private readonly lgUrl = `${environment.apiUrl}/lignes`;

  getDernierPrix(produitId: number, poissonnerieId: number){

      return this.http.get<ApiResponse<DernierPrixResponse>>(
        `${this.lgUrl}/dernier-prix?produitId=${produitId}&poissonnerieId=${poissonnerieId}`
      );
  }

  createFacture(data: CreateFactureRequest) {
    return this.http.post<ApiResponse<FactureResponse>>(`${this.apiUrl}`, data);
  }

  addLigne(factureId: number, ligneRequest: CreateLigneRequest){
    return this.http.post<ApiResponse<LigneAchatResponse>>(`${this.apiUrl}/${factureId}/lignes`, ligneRequest);
  }


  getFacturesByPoissonnerieAndDate(poissonnerieId: number, date: string) {
    return this.http.get<ApiResponse<FactureResponse[]>>(
      `${this.apiUrl}?poissonnerieId=${poissonnerieId}&date=${date}`
    );
  }

  cloturerFacture(factureId: number) {
    return this.http.put<ApiResponse<FactureResponse>>(`${this.apiUrl}/${factureId}/cloturer`, {});
  }

  getFactureDetail(factureId: number) {
    return this.http.get<ApiResponse<FactureDetailResponse>>(`${this.apiUrl}/${factureId}`);
  }

  deleteLigne(factureId: number, ligneId: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${factureId}/lignes/${ligneId}`);
  }

  downloadFacturePdf(factureId: number) {
    return this.http.get(`${environment.apiUrl}/exports/factures/${factureId}/pdf`, {
      responseType: 'blob'
    });
  }

}
