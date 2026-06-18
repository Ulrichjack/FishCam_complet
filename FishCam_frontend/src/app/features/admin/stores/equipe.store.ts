// ─── SKELETON: src/app/features/admin/stores/equipe.store.ts ─────────

import { inject, Injectable, signal } from "@angular/core";
import { EquipeService } from "../services/equipe.service";
import { firstValueFrom } from "rxjs";
import { PageResponse } from "../../../core/models/api-response.model";
import { UserResponse } from "../../../core/models/user.model";
import { CreateUserRequest, UpdateUserRequest } from "../models/user-request.model";
import { ToastService } from "../../../core/services/toast.service";

@Injectable({ providedIn: 'root' })
export class EquipeStore {

  private readonly equipeService = inject(EquipeService);
  private readonly toastService = inject(ToastService);

  private _usersPage = signal<PageResponse<UserResponse> | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly usersPage = this._usersPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // DIRECTIVE: Implement loadUsers(page, size)
  async loadUsers(page: number = 0, size: number = 20) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    try{
      const response = await firstValueFrom(this.equipeService.getAll(page, size));
      this._usersPage.set(response.data);
    } catch (error) {
      this._error.set('Erreur lors du chargement des utilisateurs');
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implement createUser(data) -> then reload page 0
  async createUser(data: CreateUserRequest) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.equipeService.create(data));
      await this.loadUsers(0);
      this.toastService.success('Employé créé avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la création de l\'utilisateur');
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implement updateUser(id, data) -> then reload current page
 async updateUser(id: number, data: UpdateUserRequest) {
    this._isLoading.set(true);
    this._error.set(null);
    try{
      await firstValueFrom(this.equipeService.update(id, data));
      const currentPage = this._usersPage()?.page?.number ?? this._usersPage()?.number ?? 0;
      this.loadUsers(currentPage);
       this.toastService.success('Employé modifié avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la mise à jour de l\'utilisateur');
    } finally {
      this._isLoading.set(false);
    }
  }

  async deleteUser(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try{
      await firstValueFrom(this.equipeService.delete(id));
      const currentPage = this._usersPage()?.page?.number ?? this._usersPage()?.number ?? 0;
      this.loadUsers(currentPage);
      this.toastService.success('Employé désactivé avec succès !');
    } catch (error) {
      this._error.set('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      this._isLoading.set(false);
    }
  }

  
  // DIRECTIVE: Implement resetPassword(userId, password)
  async resetPassword(userId: number, password: string) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.equipeService.resetPassword(userId, password));
      this.toastService.success('Mot de passe réinitialisé avec succès !');
    } catch (error: any) {
      this._error.set(error.error?.message || 'Erreur lors de la réinitialisation du mot de passe');
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }



  async reactivateUser(id: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.equipeService.reactivate(id));
      const currentPage = this._usersPage()?.page?.number ?? this._usersPage()?.number ?? 0;
      this.loadUsers(currentPage);
      this.toastService.success('Employé réactivé avec succès !'); // <-- TOAST ICI
    } catch (error) {
      this._error.set('Erreur lors de la réactivation de l\'utilisateur');
    } finally {
      this._isLoading.set(false);
    }
  }


}