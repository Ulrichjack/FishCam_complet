import { inject, Injectable, signal } from "@angular/core";
import { DashboardService } from "../../dashboard/services/dashboard.service";
import { CompteCourantResponse } from "../../../core/models/compte-courant.model";
import { firstValueFrom } from "rxjs";
import { ClientService } from "../../clients/services/client.service";
import { ToastService } from "../../../core/services/toast.service";

@Injectable({ providedIn: 'root' })
export class DettesStore {
  private readonly dashboardService = inject(DashboardService);
  private readonly clientService = inject(ClientService); 
  private readonly toastService = inject(ToastService);

  // --- STATE SIGNALS ---
  private readonly _debtors = signal<CompteCourantResponse[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly debtors = this._debtors.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---
  async loadDebtors(poissonnerieId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.dashboardService.getDebtors(poissonnerieId));
      this._debtors.set(response.data);
    } catch (err) {
      console.error("Error loading debtors:", err);
      this._error.set("Failed to load debtors. Please try again.");
    } finally {
      this._isLoading.set(false);
    }
  }

  // NOUVELLE ACTION DANS LE STORE !
  async rembourserDette(compteCourantId: number, montant: number, description: string, poissonnerieId: number) {
    try {
      // 1. On fait l'appel API
      await firstValueFrom(this.clientService.enregistrerRemboursement({
        compteCourantId,
        montant,
        description
      }));
      // 2. On recharge la liste pour mettre à jour les cartes
      await this.loadDebtors(poissonnerieId);
      this.toastService.success('Remboursement enregistré avec succès !');
    } catch (error) {
      console.error("Erreur lors du remboursement", error);
      throw error; // On renvoie l'erreur au composant pour qu'il affiche un message si besoin
    }
  }
}