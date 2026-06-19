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


  getProduits(poissonnerieId: number, page: number = 0, size: number = 20) {
    return this.http.get<ApiResponse<PageResponse<ProduitResponse>>>(
      `${this.apiUrl}/avec-prix?poissonnerieId=${poissonnerieId}&page=${page}&size=${size}`
    );
  }

  createProduit(data: CreateProduitRequest) {
    return this.http.post<ApiResponse<ProduitResponse>>(this.apiUrl, data);
  }

  updateProduit(id: number, data: UpdateProduitRequest) {
    return this.http.put<ApiResponse<ProduitResponse>>(`${this.apiUrl}/${id}`, data);
  }


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
