// ─── SKELETON: src/app/features/fournisseurs/pages/fournisseurs-list/fournisseurs-list.component.ts ─────────

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FournisseurStore } from '../../stores/fournisseur.store';
import { LucideAngularModule } from 'lucide-angular';
import { SlideOverPanelComponent } from '../../../../shared/components/slide-over-panel/slide-over-panel.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FournisseurFormComponent } from '../../components/fournisseur-form/fournisseur-form.component';
import { FournisseurResponse } from '../../../../core/models/fournisseur.model';
import { AuthStore } from '../../../../core/stores/auth.store';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
// DIRECTIVE: Import FournisseurResponse

@Component({
  selector: 'app-fournisseurs-list',
  standalone: true,
  imports: [
    LucideAngularModule,
    SlideOverPanelComponent,
    ConfirmDialogComponent,
    FournisseurFormComponent,
    FormsModule,
    LoadingSkeletonComponent, 
    EmptyStateComponent,
    ErrorStateComponent 
  ],
  templateUrl: './fournisseurs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FournisseursListComponent implements OnInit {
  
  readonly authStore = inject(AuthStore);
  readonly store = inject(FournisseurStore);
  readonly selectedStatus = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  private searchTimeout: any;

  // --- UI STATE SIGNALS ---
  readonly isSlideOverOpen = signal(false);
  readonly fournisseurToEdit = signal<FournisseurResponse | null>(null); // Replace 'any'
  
  readonly isConfirmOpen = signal(false);
  readonly fournisseurToDelete = signal<FournisseurResponse | null>(null); // Replace 'any'


  readonly filteredFournisseurs = computed(() => {
    const status = this.selectedStatus();
    const all = this.store.fournisseurs();
    
    if (status === 'ACTIVE') return all.filter(f => f.actif);
    if (status === 'INACTIVE') return all.filter(f => !f.actif);
    return all;
  });

  ngOnInit(): void {
    // DIRECTIVE: Call store.loadFournisseurs()
    // YOUR CODE HERE
    this.store.loadFournisseurs();
  }

  openCreatePanel(): void {
    // DIRECTIVE: Set fournisseurToEdit to null, open slide-over
    // YOUR CODE HERE
    this.fournisseurToEdit.set(null);
    this.isSlideOverOpen.set(true);
  }

  openEditPanel(fournisseur: FournisseurResponse): void {
    // DIRECTIVE: Set fournisseurToEdit to the selected fournisseur, open slide-over
    // YOUR CODE HERE
    this.fournisseurToEdit.set(fournisseur);
    this.isSlideOverOpen.set(true);
  }

  confirmDelete(fournisseur: FournisseurResponse): void {
    // DIRECTIVE: Set fournisseurToDelete, open confirm dialog
    // YOUR CODE HERE
    this.fournisseurToDelete.set(fournisseur);
    this.isConfirmOpen.set(true);
  }

  async executeDelete() {
    // DIRECTIVE: Call store.deleteFournisseur with the ID, then close dialog
    // YOUR CODE HERE
    if (this.fournisseurToDelete()) {
      await this.store.deleteFournisseur(this.fournisseurToDelete()!.id);
      this.isConfirmOpen.set(false);
    }
  }

  async onSaveFournisseur(data: { nom: string; ville: string; telephone: string }) {
    // DIRECTIVE: 
    // If fournisseurToEdit() exists -> call store.updateFournisseur
    // Else -> call store.createFournisseur
    // Then close the slide-over
    // YOUR CODE HERE
    if(this.fournisseurToEdit()) {
      await this.store.updateFournisseur(this.fournisseurToEdit()!.id, data);
    } else {
      await this.store.createFournisseur(data);
    }
    this.isSlideOverOpen.set(false);
  }


  onSearch(event: Event){
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    const poissonnerieId = this.authStore.activePoissonnerieId();

    if(!poissonnerieId) return;

    // Clear the previous timeout (this is the "Debounce" magic)
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if(searchTerm.trim() === ''){
        this.store.loadFournisseurs();
      } else {
        this.store.searchFournisseurs(searchTerm);
      }
    }, 500); // Wait for 500ms after the user stops typing
  }

  async reactivateFournisseur(id: number) {
    try {
      await this.store.reactivateFournisseur(id);
    } catch (error) {
      console.error('Reactivation failed', error);
    }
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status as 'ALL' | 'ACTIVE' | 'INACTIVE');
  }


}