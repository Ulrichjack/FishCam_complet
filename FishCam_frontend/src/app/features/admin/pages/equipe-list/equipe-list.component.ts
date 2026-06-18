import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EquipeStore } from '../../stores/equipe.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { LucideAngularModule } from 'lucide-angular';
import { SlideOverPanelComponent } from '../../../../shared/components/slide-over-panel/slide-over-panel.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EquipeFormComponent } from '../../components/equipe-form/equipe-form.component';
import { UserResponse } from '../../../../core/models/user.model';
import { PoissonnerieStore } from '../../stores/poissonnerie.store';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-equipe-list',
  standalone: true,
  imports: [
    LucideAngularModule,
    SlideOverPanelComponent,
    ConfirmDialogComponent,
    EquipeFormComponent,
    ModalComponent,
    FormsModule,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent
  ],
  templateUrl: './equipe-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipeListComponent implements OnInit {
  
  readonly store = inject(EquipeStore);
  readonly poissonnerieStore = inject(PoissonnerieStore);
  readonly authStore = inject(AuthStore);

  readonly isSlideOverOpen = signal(false);
  readonly userToEdit = signal<UserResponse | null>(null);
  
  readonly isConfirmOpen = signal(false);
  readonly userToDelete = signal<UserResponse | null>(null);

  readonly isResetModalOpen = signal(false);
  readonly userToReset = signal<UserResponse | null>(null);
  readonly newPassword = signal('');

  ngOnInit(): void {
    this.store.loadUsers(0, 20);
    this.poissonnerieStore.loadPoissonneries(0, 100);
  }

  openCreatePanel() {
    this.userToEdit.set(null);
    this.isSlideOverOpen.set(true);
  }

  openEditPanel(user: UserResponse) {
    this.userToEdit.set(user);
    this.isSlideOverOpen.set(true);
  }

  async onSaveUser(data: any) {
    if (this.userToEdit()) {
      await this.store.updateUser(this.userToEdit()!.id, data);
    } else {
      await this.store.createUser(data);
    }
    this.isSlideOverOpen.set(false);
  }

  confirmDelete(user: UserResponse) {
    this.userToDelete.set(user);
    this.isConfirmOpen.set(true);
  }

  async executeDelete() {
    if (this.userToDelete()) {
      await this.store.deleteUser(this.userToDelete()!.id);
      this.isConfirmOpen.set(false);
    }
  }

  openResetModal(user: UserResponse) {
    this.userToReset.set(user);
    this.newPassword.set('');
    this.isResetModalOpen.set(true);
  }

  async executeResetPassword() {
    const user = this.userToReset();
    const pwd = this.newPassword();
    if (!user || pwd.length < 6) return;

    try {
      await this.store.resetPassword(user.id, pwd);
      this.isResetModalOpen.set(false);
      // Optionnel: un toast ici serait mieux qu'un alert
    } catch (e) {
      console.error(e);
    }
  }
  
  onPageChange(page: number): void {
    this.store.loadUsers(page, 20);
  }


  async reactivateUser(id: number) {
    await this.store.reactivateUser(id);
  }


}