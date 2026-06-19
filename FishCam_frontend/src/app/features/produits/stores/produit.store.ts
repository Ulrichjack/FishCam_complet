// ─── SKELETON: produit.store.ts ──────────────────────────────
import { inject, Injectable, signal } from "@angular/core";
import { ProduitService } from "../services/produit.service";
import { firstValueFrom } from "rxjs";
import { ProduitResponse } from "../../../core/models/produit.model";
import { PageResponse } from "../../../core/models/api-response.model";
import { CreateProduitRequest, UpdateProduitRequest } from "../models/produit-request.model";
import { ToastService } from "../../../core/services/toast.service";
import { AuthStore } from "../../../core/stores/auth.store";

@Injectable({ providedIn: 'root' })
export class ProduitStore {
  private readonly produitService = inject(ProduitService);
  private readonly toastService = inject(ToastService);
  private readonly authStore = inject(AuthStore);


  // --- STATE SIGNALS ---
  private readonly _produitsPage = signal<PageResponse<ProduitResponse> | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly produitsPage = this._produitsPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---
    async loadProduits(page: number = 0) {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (!poissonnerieId) return;

    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.produitService.getProduits(poissonnerieId, page));
      this._produitsPage.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des produits');
    } finally {
      this._isLoading.set(false);
    }
  }

  async createProduit(data: CreateProduitRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.produitService.createProduit(data));
      this.loadProduits(0);
      this.toastService.success('Produit créé avec succès !');
    } catch (err) {
      this._error.set('Erreur lors de la création du produit');
    } finally {
      this._isLoading.set(false);
    }
  }


  async updateProduit(id: number, data: UpdateProduitRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.produitService.updateProduit(id, data));
      this.loadProduits(this._produitsPage()?.number || 0);
      this.toastService.success('Produit modifié avec succès !');
    } catch (err) {
      this._error.set('Erreur lors de la mise à jour du produit');
    } finally {
      this._isLoading.set(false);
    }
  }


  async deleteProduit(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.produitService.deleteProduit(id));
      this.loadProduits(this._produitsPage()?.number || 0);
      this.toastService.success('Produit supprimé avec succès !');
    } catch (err) {
      this._error.set('Erreur lors de la suppression du produit');
    } finally {
      this._isLoading.set(false);
    }
  }

  async searchProduits(q: string) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.produitService.searchProduits(q));
      // On simule une PageResponse pour que le tableau HTML fonctionne sans modification
      const fakePage: PageResponse<ProduitResponse> = {
        content: response.data,
        totalElements: response.data.length,
        totalPages: 1,
        number: 0,
        size: response.data.length,
        first: true,
        last: true,
        numberOfElements: response.data.length,
        empty: response.data.length === 0
      };
      this._produitsPage.set(fakePage);
    } catch (err) {
      this._error.set('Erreur lors de la recherche des produits');
    } finally {
      this._isLoading.set(false);
    }
  }

  async reactivateProduit(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.produitService.reactivateProduit(id));
      this.loadProduits(this._produitsPage()?.number || 0);
      this.toastService.success('Produit réactivé avec succès !');
    } catch (err) {
      this._error.set('Erreur lors de la réactivation du produit');
    } finally {
      this._isLoading.set(false);
    }
  }

}
