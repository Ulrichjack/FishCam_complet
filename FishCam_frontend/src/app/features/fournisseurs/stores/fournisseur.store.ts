
import { inject, Injectable, signal } from "@angular/core";
import { FournisseurService } from "../services/fournisseur.service";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { FournisseurResponse } from "../../../core/models/fournisseur.model";
// DIRECTIVE: Import FournisseurResponse

@Injectable({ providedIn: 'root' })
export class FournisseurStore {
  private readonly fournisseurService = inject(FournisseurService);
  private readonly toastService = inject(ToastService);

  // --- STATE SIGNALS ---
  private _fournisseurs = signal<FournisseurResponse[]>([]); // Replace 'any' with FournisseurResponse
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly fournisseurs = this._fournisseurs.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---

  // DIRECTIVE: Implement loadFournisseurs()
  // 1. Set isLoading to true, error to null
  // 2. Call service.getAll()
  // 3. Set _fournisseurs with result.data
  // 4. Handle errors and finally block
  async loadFournisseurs() {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const response = await firstValueFrom(this.fournisseurService.getAll());
      this._fournisseurs.set(response.data);
    } catch (error) {
      this._error.set("Erreur lors du chargement des fournisseurs.");
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implement createFournisseur(data)
  // 1. Call service.create(data)
  // 2. Reload the list (this.loadFournisseurs())
  async createFournisseur(data: { nom: string; ville: string; telephone: string }) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      await firstValueFrom(this.fournisseurService.create(data));
      await this.loadFournisseurs();
      this.toastService.success('Fournisseur créé avec succès !');
    } catch (error) {
      this._error.set("Erreur lors de la création du fournisseur.");
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implement updateFournisseur(id, data)
  // 1. Call service.update(id, data)
  // 2. Reload the list
  async updateFournisseur(id: number, data: { nom: string; ville: string; telephone: string }) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      await firstValueFrom(this.fournisseurService.update(id, data));
      await this.loadFournisseurs();
      this.toastService.success('Fournisseur modifié avec succès !');
    } catch (error) {
      this._error.set("Erreur lors de la mise à jour du fournisseur.");
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implement deleteFournisseur(id)
  // 1. Call service.delete(id)
  // 2. Reload the list
  async deleteFournisseur(id: number) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      await firstValueFrom(this.fournisseurService.delete(id));
      await this.loadFournisseurs();
      this.toastService.success('Fournisseur supprimé avec succès !');
    } catch (error) {
      this._error.set("Erreur lors de la suppression du fournisseur.");
    } finally {
      this._isLoading.set(false);
    }
  }


  async searchFournisseurs(term: string) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.fournisseurService.searchFournisseurs(term));
      this._fournisseurs.set(response.data);
    } catch (error) {
      this._error.set("Erreur lors de la recherche des fournisseurs.");
    } finally {
      this._isLoading.set(false);
    }
  }

  async reactivateFournisseur(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.fournisseurService.reactivateFournisseur(id));
      await this.loadFournisseurs();
      this.toastService.success('Fournisseur réactivé avec succès !');
    } catch (error) {
      this._error.set("Erreur lors de la réactivation du fournisseur.");
    } finally {
      this._isLoading.set(false);
    }
  }

}