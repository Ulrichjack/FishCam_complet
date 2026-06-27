// ─── SKELETON: src/app/features/cloture/stores/cloture.store.ts ─────────

import { inject, Injectable, signal } from "@angular/core";
import { ClotureService } from "../services/cloture.service";
import { firstValueFrom } from "rxjs";
import { ClotureJournaliereRequest, ClotureJournaliereResponse, PreparationClotureResponse } from "../../../core/models/cloture.model";
import { ToastService } from "../../../core/services/toast.service";
import { PageResponse } from "../../../core/models/api-response.model";

@Injectable({ providedIn: 'root' })
export class ClotureStore {
  private readonly clotureService = inject(ClotureService);
  private readonly toastService = inject(ToastService);

  // --- STATE SIGNALS ---
  private _preparation = signal<PreparationClotureResponse | null>(null);
  private _historiquePage = signal<PageResponse<ClotureJournaliereResponse> | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly preparation = this._preparation.asReadonly();
  readonly historiquePage = this._historiquePage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---

  async loadPageData(poissonnerieId: number, date: string, page: number = 0) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const [prepRes, histRes] = await Promise.all([
        firstValueFrom(this.clotureService.preparerCloture(poissonnerieId, date)),
        firstValueFrom(this.clotureService.getHistorique(poissonnerieId, page)) // <-- Ajout de page
      ]);
      this._preparation.set(prepRes.data);
      this._historiquePage.set(histRes.data); // <-- Modifié
    } catch (error: any) {
      this._error.set(error.message || 'Erreur lors du chargement des données.');
    } finally {
      this._isLoading.set(false);
    }
  }

  // 3. Modifie submitCloture
  async submitCloture(request: ClotureJournaliereRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clotureService.cloturer(request));
      // On recharge la page 0 de l'historique
      const histRes = await firstValueFrom(this.clotureService.getHistorique(request.poissonnerieId, 0));
      this._historiquePage.set(histRes.data);
      this.toastService.success('Journée clôturée avec succès !');
    } catch (error: any) {
      this._error.set(error.message || 'Erreur lors de la clôture.');
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }
}
