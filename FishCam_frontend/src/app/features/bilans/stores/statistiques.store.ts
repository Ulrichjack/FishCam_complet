import { inject, Injectable, signal } from "@angular/core";
import { StatistiquesService } from "../services/statistiques.service";
import { firstValueFrom } from "rxjs";
import { StatistiquesGlobalesResponse, StatistiquesPoissonnerieResponse } from "../../../core/models/statistiques.model";

@Injectable({ providedIn: 'root' })
export class StatistiquesStore {
  private readonly statsService = inject(StatistiquesService);

  private _statsPoissonnerie = signal<StatistiquesPoissonnerieResponse | null>(null);
  private _statsGlobales = signal<StatistiquesGlobalesResponse | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly statsPoissonnerie = this._statsPoissonnerie.asReadonly();
  readonly statsGlobales = this._statsGlobales.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  async loadStatsPoissonnerie(poissonnerieId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.statsService.getDashboardStats(poissonnerieId));
      this._statsPoissonnerie.set(response.data);
    } catch (err: any) {
      this._error.set("Erreur lors du chargement des statistiques.");
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadStatsGlobales() {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.statsService.getGlobalDashboardStats());
      this._statsGlobales.set(response.data);
    } catch (err: any) {
      this._error.set("Erreur lors du chargement des statistiques globales.");
    } finally {
      this._isLoading.set(false);
    }
  }
}