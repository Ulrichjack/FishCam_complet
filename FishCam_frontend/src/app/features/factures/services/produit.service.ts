import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProduitResponse } from '../../../core/models/produit.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/produits`;

  searchProduits(query: string): Observable<ProduitResponse[]> {
    return this.http.get<ApiResponse<ProduitResponse[]>>(`${this.apiUrl}/search?q=${query}`)
      .pipe(map(res => res.data));
  }
  
}
