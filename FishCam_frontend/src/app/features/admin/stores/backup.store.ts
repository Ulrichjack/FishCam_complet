import { inject, Injectable, signal } from "@angular/core";
import { BackupService, BackupStatus } from "../services/backup.service";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";

@Injectable({ providedIn: 'root' })
export class BackupStore {
  private readonly backupService = inject(BackupService);
  private readonly toastService = inject(ToastService);

  private _status = signal<BackupStatus | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly status = this._status.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  loadStatus() {
    this._isLoading.set(true);
    this._error.set(null);

    firstValueFrom(this.backupService.getStatus())
      .then(response => {
        if (response.success) {
          this._status.set(response.data);
        } else {
          this._error.set('Failed to load backup status.');
        }
      })
      .catch(() => {
        this._error.set('An error occurred while loading backup status.');
      })
      .finally(() => {
        this._isLoading.set(false);
      });
  }

 // NOUVELLE MÉTHODE POUR LE CLOUD (Modifiée)
  async syncCloud(isAuto: boolean = false) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.backupService.syncCloud());
      this.toastService.success(response.message);
      this.loadStatus(); // Recharge le statut pour enlever la bannière rouge
    } catch (error: any) {
      // Si c'est l'utilisateur qui a cliqué, on affiche l'erreur
      if (!isAuto) {
        this._error.set(error.error?.message || 'Erreur lors de la synchronisation');
      } else {
        // Si c'est l'auto-sauvegarde, on log juste en silence
        console.warn("Auto-sauvegarde échouée (probablement pas d'internet). On réessaiera plus tard.");
      }
    } finally {
      this._isLoading.set(false);
    }
  }
}
