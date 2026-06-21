import { inject, Injectable, signal } from "@angular/core";
import { BilanService } from "../services/bilan.service";
import { firstValueFrom } from "rxjs";
import { BilanMensuelResponse, ComparaisonBoutiquesResponse } from "../../../core/models/bilan.model";

@Injectable({ providedIn: 'root' })
export class BilanStore {
  private readonly bilanService = inject(BilanService);

  // --- STATE SIGNALS ---
  private _bilan = signal<BilanMensuelResponse | null>(null);
  private _comparaison = signal<ComparaisonBoutiquesResponse | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly bilan = this._bilan.asReadonly();
  readonly comparaison = this._comparaison.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---

  // DIRECTIVE: Implement loadBilan(poissonnerieId: number, mois: number, annee: number)
  // 1. Set isLoading to true, error to null, _bilan to null
  // 2. Call service.getBilanMensuel
  // 3. Set _bilan with result.data
  // 4. Handle errors and finally block
  async loadBilan(poissonnerieId: number, mois: number, annee: number) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    this._bilan.set(null);

    try {
      const response = await firstValueFrom(this.bilanService.getBilanMensuel(poissonnerieId, mois, annee));
      this._bilan.set(response.data);
    } catch (error: any) {
       if (error.status === 400) {
        this._error.set("Aucune donnée financière n'est disponible pour ce mois.");
      } else {
        this._error.set(error.error?.message || 'Une erreur est survenue lors du chargement du bilan.');
      }
    } finally {
      this._isLoading.set(false);
    }
  }
  
  // DIRECTIVE: Implement loadComparaison(mois: number, annee: number)
  // 1. Set isLoading to true, error to null, _comparaison to null
  // 2. Call service.compareBoutiques
  // 3. Set _comparaison with result.data
  // 4. Handle errors and finally block
  async loadComparaison(mois: number, annee: number) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    this._comparaison.set(null);

    try {
      const response = await firstValueFrom(this.bilanService.compareBoutiques(mois, annee));
      this._comparaison.set(response.data);
    } catch (error: any) {
      this._error.set(error.message || 'An error occurred while loading the comparaison.');
    } finally {
      this._isLoading.set(false);
    }
  }
}
