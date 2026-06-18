import { inject, Injectable, signal } from "@angular/core";
import { AchatJournalierService } from "../services/achat-journalier.service";
import { FactureResponse } from "../../../core/models/facture.model";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";



@Injectable({
  providedIn: 'root'
})
export class FactureStore {

  private readonly achatService = inject(AchatJournalierService);
  private readonly toastService = inject(ToastService);

  private readonly _factures = signal<FactureResponse[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);


  readonly factures = this._factures.asReadonly();
  readonly isLoading = this._isLoading.asReadonly()
  readonly error = this._error.asReadonly();

  async loadFactures(poisonnerieId: number, date: string) {
    this._isLoading.set(true);
    this._error.set(null);

    try{
      const response = await firstValueFrom(this.achatService.getFacturesByPoissonnerieAndDate(poisonnerieId, date));
      this._factures.set(response.data);
    } catch (error) {
      this._error.set('Erreur lors du chargement des factures');
    } finally {
      this._isLoading.set(false);
    }
  }

  async cloturerFacture(factureId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      await firstValueFrom(this.achatService.cloturerFacture(factureId));
      this._factures.update(list => list.map(f => f.id === factureId ? { ...f, cloture: true } : f));
      this.toastService.success('Facture clôturée avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la clôture de la facture');
    } finally {
      this._isLoading.set(false);
    }
  }

}
