// ─── SKELETON: src/app/features/transactions/services/transaction.service.ts ─────────

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { TransactionGlobalResponse } from '../../../core/models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comptes-courants`;

 
  getTransactions(
    poissonnerieId: number, 
    page: number = 0,
    size: number = 20,
    type?: string,
    searchTerm?: string,
    date?: string
  ) {
    // 1. Initialize params with page and size (they always have a value)
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    // 2. Conditionally add the other parameters
    if (type) {
      params = params.set('type', type);
    }
    // DO THE SAME FOR searchTerm AND date...
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    if (date) {
      params = params.set('date', date);
    }

    // 3. Return the http call
    return this.http.get<ApiResponse<PageResponse<TransactionGlobalResponse>>>(
      `${this.apiUrl}/poissonnerie/${poissonnerieId}/transactions`, 
      { params }
    );
  }
}