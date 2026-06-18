import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/api-response.model';
import { EvaluationLivreurResponse } from '../../../core/models/evaluation.model';
import { CreateEvaluationRequest } from '../models/evaluation-request.model';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/evaluations`;

  submitEvaluation(data: CreateEvaluationRequest ) {
    return this.http.post<ApiResponse<EvaluationLivreurResponse>>(this.apiUrl, data);
  }

  getEvaluationByFacture(factureId: number) {
    return this.http.get<ApiResponse<EvaluationLivreurResponse>>(`${this.apiUrl}/facture/${factureId}`);
  }


  getEvaluation(livreurId: number) {
    return this.http.get<ApiResponse<EvaluationLivreurResponse[]>>(`${this.apiUrl}/livreur/${livreurId}`);
  }

}