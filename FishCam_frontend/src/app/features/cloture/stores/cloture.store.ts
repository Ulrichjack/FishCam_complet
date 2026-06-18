// ─── SKELETON: src/app/features/cloture/stores/cloture.store.ts ─────────

import { inject, Injectable, signal } from "@angular/core";
import { ClotureService } from "../services/cloture.service";
import { firstValueFrom } from "rxjs";
import { ClotureJournaliereRequest, ClotureJournaliereResponse, PreparationClotureResponse } from "../../../core/models/cloture.model";
import { ToastService } from "../../../core/services/toast.service";

@Injectable({ providedIn: 'root' })
export class ClotureStore {
  private readonly clotureService = inject(ClotureService);
  private readonly toastService = inject(ToastService);

  // --- STATE SIGNALS ---
  private _preparation = signal<PreparationClotureResponse | null>(null);
  private _historique = signal<ClotureJournaliereResponse[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly preparation = this._preparation.asReadonly();
  readonly historique = this._historique.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---

  async loadPageData(poissonnerieId: number, date: string) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      // On lance les deux requêtes en parallèle (plus rapide et un seul loading)
      const [prepRes, histRes] = await Promise.all([
        firstValueFrom(this.clotureService.preparerCloture(poissonnerieId, date)),
        firstValueFrom(this.clotureService.getHistorique(poissonnerieId))
      ]);
      this._preparation.set(prepRes.data);
      this._historique.set(histRes.data);
    } catch (error: any) {
      this._error.set(error.message || 'Erreur lors du chargement des données.');
    } finally {
      this._isLoading.set(false);
    }
  }

  // (Garde la fonction submitCloture, mais modifie-la pour qu'elle appelle le endpoint d'historique directement)
  async submitCloture(request: ClotureJournaliereRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clotureService.cloturer(request));
      // Après la clôture, on recharge juste l'historique manuellement
      const histRes = await firstValueFrom(this.clotureService.getHistorique(request.poissonnerieId));
      this._historique.set(histRes.data);
      this.toastService.success('Journée clôturée avec succès !');
    } catch (error: any) {
      this._error.set(error.message || 'Erreur lors de la clôture.');
      throw error; // Important de jeter l'erreur pour ne pas fermer la modale si ça plante
    } finally {
      this._isLoading.set(false);
    }
  }
}