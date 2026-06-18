// ─── SKELETON: src/app/features/admin/services/equipe.service.ts ─────────

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { UserResponse } from '../../../core/models/user.model';
import { CreateUserRequest, UpdateUserRequest } from '../models/user-request.model';

@Injectable({ providedIn: 'root' })
export class EquipeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`; 
  private readonly authUrl = `${environment.apiUrl}/auth`;

  getAll(page: number = 0, size: number = 20) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<UserResponse>>>(this.apiUrl, { params });
  }

  create(data: CreateUserRequest) {
    return this.http.post<ApiResponse<UserResponse>>(this.apiUrl, data);
  }

  update(id: number, data: UpdateUserRequest) {
    return this.http.put<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  
  resetPassword(userId: number, nouveauMotDePasse: string) {
    const body = { userId, nouveauMotDePasse };
    return this.http.put<ApiResponse<void>>(`${this.authUrl}/reset-password`, body);
  }


  reactivate(id: number) {
    return this.http.patch<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}/reactivate`, {});
  }




}