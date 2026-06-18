import { inject, Injectable, signal } from "@angular/core";
import { PoissonnerieService } from "../services/poissonnerie.service";
import { firstValueFrom } from "rxjs";
import { PageResponse } from "../../../core/models/api-response.model";
import { CreatePoissonnerieRequest, UpdatePoissonnerieRequest } from "../models/poissonnerie-request.model";
import { PoissonnerieResponse } from "../../../core/models/poissonnerie-response.model";
import { ToastService } from "../../../core/services/toast.service";

@Injectable({ providedIn: 'root' })
export class PoissonnerieStore {
  private readonly poissonnerieService = inject(PoissonnerieService);
  private readonly toastService = inject(ToastService);

  private _poissonneriesPage = signal<PageResponse<PoissonnerieResponse> | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly poissonneriesPage = this._poissonneriesPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  async loadPoissonneries(page: number = 0, size: number = 20) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.poissonnerieService.getAll(page, size));
      this._poissonneriesPage.set(response.data);
    } catch (error) {
      this._error.set('Erreur lors du chargement des poissonneries');
    } finally {
      this._isLoading.set(false);
    }
  }

  async createPoissonnerie(data: CreatePoissonnerieRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.poissonnerieService.create(data));
      await this.loadPoissonneries(0, 20);
       this.toastService.success('Poissonnerie créée avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la création de la poissonnerie');
    } finally {
      this._isLoading.set(false);
    }
  }

  async updatePoissonnerie(id: number, data: UpdatePoissonnerieRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.poissonnerieService.update(id, data));
      const currentPage = this._poissonneriesPage()?.page?.number ?? this._poissonneriesPage()?.number ?? 0;
      const currentSize = this._poissonneriesPage()?.size || 20;
      await this.loadPoissonneries(currentPage, currentSize);
      this.toastService.success('Poissonnerie modifiée avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la mise à jour de la poissonnerie');
    } finally {
      this._isLoading.set(false);
    }
  }

  async deletePoissonnerie(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.poissonnerieService.delete(id));
      const currentPage = this._poissonneriesPage()?.page?.number ?? this._poissonneriesPage()?.number ?? 0;
      const currentSize = this._poissonneriesPage()?.size || 20;
      await this.loadPoissonneries(currentPage, currentSize);
      this.toastService.success('Poissonnerie désactivée avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la suppression de la poissonnerie');
    } finally {
      this._isLoading.set(false);
    }
  }

  async reactivatePoissonnerie(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.poissonnerieService.reactivate(id));
      const currentPage = this._poissonneriesPage()?.number || 0; // CORRIGÉ ICI
      const currentSize = this._poissonneriesPage()?.size || 20;
      await this.loadPoissonneries(currentPage, currentSize);
      this.toastService.success('Poissonnerie réactivée avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la réactivation de la poissonnerie');
    } finally {
      this._isLoading.set(false);
    }
  }
}