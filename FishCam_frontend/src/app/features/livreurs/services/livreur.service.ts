import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { LivreurResponse } from '../../../core/models/livreur.model';
import { CreateLivreurRequest, UpdateLivreurRequest } from '../models/livreur-request.model';

@Injectable({ providedIn: 'root' })
export class LivreurService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/livreurs`;

  // DIRECTIVE: Implémente getAll()
  // Retourne un GET vers /api/v1/livreurs (Attention, ça renvoie une List, pas une Page)
  // YOUR CODE HERE
  getAll(){
    return this.http.get<ApiResponse<LivreurResponse[]>>(this.apiUrl);
  }

  // DIRECTIVE: Implémente createLivreur(data: CreateLivreurRequest)
  // Retourne un POST vers /api/v1/livreurs
  // YOUR CODE HERE
  createLivreur(data: CreateLivreurRequest){
    return this.http.post<ApiResponse<LivreurResponse>>(this.apiUrl, data);
  }

  // DIRECTIVE: Implémente toggleStatut(id: number)
  // Retourne un PATCH vers /api/v1/livreurs/{id}/toggle-statut
  // YOUR CODE HERE
  toggleStatut(id: number){
    return this.http.patch<ApiResponse<LivreurResponse>>(`${this.apiUrl}/${id}/toggle-statut`, {});
  }

  updateLivreur(id: number, data: UpdateLivreurRequest) {
    return this.http.put<ApiResponse<LivreurResponse>>(`${this.apiUrl}/${id}`, data);
  }
  
}