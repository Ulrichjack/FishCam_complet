import { inject, Injectable, signal } from "@angular/core";
import { LivreurService } from "../services/livreur.service";
import { firstValueFrom } from "rxjs";
import { LivreurResponse } from "../../../core/models/livreur.model";
import { CreateLivreurRequest, UpdateLivreurRequest } from "../models/livreur-request.model";
import { ToastService } from "../../../core/services/toast.service";

@Injectable({ providedIn: 'root' })
export class LivreurStore {
  private readonly livreurService = inject(LivreurService);
  private readonly toastService = inject(ToastService);

  // --- STATE SIGNALS ---
  private readonly _livreurs = signal<LivreurResponse[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly livreurs = this._livreurs.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---

  // DIRECTIVE: Implémente loadLivreurs()
  // Gère isLoading, error, et appelle le service avec firstValueFrom
  // Met à jour _livreurs avec response.data
  // YOUR CODE HERE
  async loadLivreurs() {
    this._isLoading.set(true);
    this._error.set(null);

    try{
      const response = await firstValueFrom(this.livreurService.getAll());
      this._livreurs.set(response.data);
    } catch (error) {
      this._error.set('Erreur lors du chargement des livreurs');
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implémente createLivreur(data: CreateLivreurRequest)
  // Gère isLoading, error, appelle le service.
  // Si succès, recharge la liste (this.loadLivreurs())
  // YOUR CODE HERE
  async createLivreur(data: CreateLivreurRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try{
      await firstValueFrom(this.livreurService.createLivreur(data));
      await this.loadLivreurs();
      this.toastService.success('Livreur créé avec succès !');
    }
    catch (error) {
      this._error.set('Erreur lors de la création du livreur');
    } finally {
      this._isLoading.set(false);
    }
   }

  // DIRECTIVE: Implémente toggleStatut(id: number)
  // Gère isLoading, error, appelle le service.
  // Si succès, met à jour le statut du livreur directement dans le signal _livreurs 
  // (utilise this._livreurs.update(list => list.map(...)))
  // YOUR CODE HERE
  async toggleStatut(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try{
      const response = await firstValueFrom(this.livreurService.toggleStatut(id));
      const updatedLivreur = response.data;
      this._livreurs.update(list => list.map(l => l.id === id ? updatedLivreur : l));
      this.toastService.success('Statut du livreur modifié !');
    }
    catch (error) {
      this._error.set('Erreur lors de la mise à jour du statut du livreur');
    } finally {
      this._isLoading.set(false);
    }
   }

   async updateLivreur(id: number, data: UpdateLivreurRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.livreurService.updateLivreur(id, data));
      await this.loadLivreurs();
      this.toastService.success('Livreur modifié avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la modification du livreur');
    } finally {
      this._isLoading.set(false);
    }
  }
   
}