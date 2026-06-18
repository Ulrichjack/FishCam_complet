import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { AuthStore } from '../stores/auth.store';
import { tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(phone: string,  password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { phone, password }).pipe(
      tap(response => {
        localStorage.setItem('fishcam_token', response.data.token);
        this.authStore.setUser(response.data.user);
      })
    );
  }

  changePassword(data: { ancienMotDePasse: string, nouveauMotDePasse: string }) {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/change-password`, data);
  }


}
