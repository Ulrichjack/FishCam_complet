import { inject, Injectable, signal } from "@angular/core";
import { RecapitulatifService } from "../services/recapitulatif.service";
import { firstValueFrom } from "rxjs";
import { RecapitulatifResponse } from "../../../core/models/recapitulatif.model";
import { ToastService } from "../../../core/services/toast.service";

@Injectable({ providedIn: 'root' })
export class RecapitulatifStore {
  private readonly recapService = inject(RecapitulatifService);
  private readonly toastService = inject(ToastService); 

  private _recapitulatif = signal<RecapitulatifResponse | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly recapitulatif = this._recapitulatif.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  async loadRecapitulatif(poissonnerieId: number, start: string, end: string) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.recapService.generateRecapitulatif(poissonnerieId, start, end));
      this._recapitulatif.set(response.data);
    } catch (err: any) {
      this._error.set(err.error?.message || "Erreur lors de la génération du récapitulatif.");
    } finally {
      this._isLoading.set(false);
    }
  }

  async downloadPdf(poissonnerieId: number, start: string, end: string) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const blob = await firstValueFrom(this.recapService.downloadPdf(poissonnerieId, start, end));
      
      // Création de l'URL locale pour le fichier binaire
      const url = window.URL.createObjectURL(blob);
      
      // Création d'un lien invisible pour forcer le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `Recapitulatif_${start}_au_${end}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyage
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.toastService.success('Téléchargement du PDF démarré !');
    } catch (err: any) {
      this._error.set("Erreur lors du téléchargement du PDF.");
    } finally {
      this._isLoading.set(false);
    }
  }
}