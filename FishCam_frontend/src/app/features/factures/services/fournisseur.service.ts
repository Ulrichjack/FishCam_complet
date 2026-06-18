import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class FournisseurService {
  private http = inject(HttpClient);
  
  getAll() {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/fournisseurs`);
  }
}