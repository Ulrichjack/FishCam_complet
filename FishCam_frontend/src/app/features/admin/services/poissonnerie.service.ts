import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { CreatePoissonnerieRequest, UpdatePoissonnerieRequest } from '../models/poissonnerie-request.model';
import { PoissonnerieResponse } from '../../../core/models/poissonnerie-response.model';

@Injectable({ providedIn: 'root' })
export class PoissonnerieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/poissonneries`;

  getAll(page: number = 0, size: number = 20) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<PoissonnerieResponse>>>(this.apiUrl, { params });
  }

  create(data: CreatePoissonnerieRequest) {
    return this.http.post<ApiResponse<PoissonnerieResponse>>(this.apiUrl, data);
  }

  update(id: number, data: UpdatePoissonnerieRequest) {
    return this.http.put<ApiResponse<PoissonnerieResponse>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  reactivate(id: number) {
    return this.http.patch<ApiResponse<PoissonnerieResponse>>(`${this.apiUrl}/${id}/reactivate`, {});
  }
}