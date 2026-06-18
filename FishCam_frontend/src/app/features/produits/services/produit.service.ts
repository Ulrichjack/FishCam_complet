// ─── SKELETON: produit.service.ts ──────────────────────────────
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { ProduitResponse } from '../../../core/models/produit.model';
import { CreateProduitRequest, UpdateProduitRequest } from '../models/produit-request.model';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/produits`;

  // DIRECTIVE: Implémente getProduits(page: number = 0, size: number = 20)
  // Retourne un GET vers /api/v1/produits?page=X&size=Y
  // YOUR CODE HERE
  getProduits(page: number = 0, size: number = 20) {
  return this.http.get<ApiResponse<PageResponse<ProduitResponse>>>(`${this.apiUrl}?page=${page}&size=${size}`);
}

  // DIRECTIVE: Implémente createProduit(data: CreateProduitRequest)
  // Retourne un POST vers /api/v1/produits
  // YOUR CODE HERE
  createProduit(data: CreateProduitRequest) {
    return this.http.post<ApiResponse<ProduitResponse>>(this.apiUrl, data);
  }

  // DIRECTIVE: Implémente updateProduit(id: number, data: UpdateProduitRequest)
  // Retourne un PUT vers /api/v1/produits/{id}
  // YOUR CODE HERE
  updateProduit(id: number, data: UpdateProduitRequest) {
    return this.http.put<ApiResponse<ProduitResponse>>(`${this.apiUrl}/${id}`, data);
  }

  // DIRECTIVE: Implémente deleteProduit(id: number)
  // Retourne un DELETE vers /api/v1/produits/{id}
  // YOUR CODE HERE
  deleteProduit(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  searchProduits(q: string) {
    return this.http.get<ApiResponse<ProduitResponse[]>>(`${this.apiUrl}/search?q=${q}`);
  }


  reactivateProduit(id: number) {
    return this.http.patch<ApiResponse<ProduitResponse>>(`${this.apiUrl}/${id}/reactivate`, {});
  }

}