// ─── SKELETON: src/app/features/transactions/stores/transaction.store.ts ─────────

import { inject, Injectable, signal } from "@angular/core";
import { TransactionService } from "../services/transaction.service";
import { firstValueFrom } from "rxjs";
import { TransactionGlobalResponse } from "../../../core/models/transaction.model";

@Injectable({ providedIn: 'root' })
export class TransactionStore {
  private readonly transactionService = inject(TransactionService);

  // --- STATE SIGNALS ---
  private _transactions = signal<TransactionGlobalResponse[]>([]);
  private _totalElements = signal<number>(0); // DIRECTIVE: Added for pagination
  private _totalPages = signal<number>(0);    // DIRECTIVE: Added for pagination
  private _isLoading = signal<boolean>(false);  
  private _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly transactions = this._transactions.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---
  // DIRECTIVE: 
  // 1. Call this.transactionService.getTransactions(...)
  // 2. Set _transactions with result.data.content
  // 3. Set _totalElements with result.data.totalElements
  // 4. Set _totalPages with result.data.totalPages
  async loadTransactions(
    poissonnerieId: number, 
    page: number = 0,
    size: number = 20,
    type?: string,
    searchTerm?: string,
    date?: string
  ) {
     this._isLoading.set(true);
     this._error.set(null);
     try{ 
       const result = await firstValueFrom(this.transactionService.getTransactions(poissonnerieId, page, size, type, searchTerm, date));
        this._transactions.set(result.data.content);
        this._totalElements.set(result.data?.page?.totalElements ?? result.data.totalElements ?? 0);
        this._totalPages.set(result.data?.page?.totalPages ?? result.data.totalPages ?? 0);
     } catch (error) {
       this._error.set('Failed to load transactions');
     } finally {
       this._isLoading.set(false);
     }
  }
}