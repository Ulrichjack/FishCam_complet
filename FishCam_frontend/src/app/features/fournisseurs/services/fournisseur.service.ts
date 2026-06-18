
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { FournisseurResponse } from '../../../core/models/fournisseur.model';
import { CreateFournisseurRequest, UpdateFournisseurRequest } from '../models/fournisseur-request.model';
// DIRECTIVE: Import FournisseurResponse from your models (create the model file if it doesn't exist)

@Injectable({ providedIn: 'root' })
export class FournisseurService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/fournisseurs`;

  // DIRECTIVE: Implement getAll() -> GET /api/v1/fournisseurs
  // Returns ApiResponse<FournisseurResponse[]>
  getAll() {
    // YOUR CODE HERE
    return this.http.get<ApiResponse<FournisseurResponse[]>>(this.apiUrl);
  }

  // DIRECTIVE: Implement create(data) -> POST /api/v1/fournisseurs
  create(data: CreateFournisseurRequest) {
    // YOUR CODE HERE
    return this.http.post<ApiResponse<FournisseurResponse>>(this.apiUrl, data); 
  }

  // DIRECTIVE: Implement update(id, data) -> PUT /api/v1/fournisseurs/{id}
  update(id: number, data: UpdateFournisseurRequest) {
    // YOUR CODE HERE
    return this.http.put<ApiResponse<FournisseurResponse>>(`${this.apiUrl}/${id}`, data);
  }

  // DIRECTIVE: Implement delete(id) -> DELETE /api/v1/fournisseurs/{id}
  delete(id: number) {
    // YOUR CODE HERE
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  searchFournisseurs(term: string) {
    return this.http.get<ApiResponse<FournisseurResponse[]>>(`${this.apiUrl}/search`, { params: { term } });
  }

  reactivateFournisseur(id: number) {
    return this.http.patch<ApiResponse<FournisseurResponse>>(`${this.apiUrl}/${id}/reactivate`, {});
  }

}