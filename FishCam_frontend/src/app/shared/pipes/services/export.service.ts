import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/exports`;

  // DIRECTIVE: Fais un appel GET vers /api/v1/exports/epargnes/{epargneId}/pdf
  // ATTENTION: Tu dois absolument passer l'option { responseType: 'blob' } pour que le fichier ne soit pas corrompu.
  // Retourne un Observable de Blob
  downloadEpargnePdf(epargneId: number) {
    return this.http.get(`${this.apiUrl}/epargnes/${epargneId}/pdf`, { responseType: 'blob' });
  }
}