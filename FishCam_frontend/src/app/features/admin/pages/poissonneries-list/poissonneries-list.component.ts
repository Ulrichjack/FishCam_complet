import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PoissonnerieStore } from '../../stores/poissonnerie.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { LucideAngularModule } from 'lucide-angular';
import { SlideOverPanelComponent } from '../../../../shared/components/slide-over-panel/slide-over-panel.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PoissonnerieFormComponent } from '../../components/poissonnerie-form/poissonnerie-form.component';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { PoissonnerieResponse } from '../../../../core/models/poissonnerie-response.model';
import { FormsModule } from '@angular/forms'; // <-- N'oublie pas FormsModule !

@Component({
  selector: 'app-poissonneries-list',
  standalone: true,
  imports: [
    LucideAngularModule,
    SlideOverPanelComponent,
    ConfirmDialogComponent,
    PoissonnerieFormComponent,
    CurrencyFcfaPipe,
    FormsModule // <-- AJOUTÉ ICI
  ],
  templateUrl: './poissonneries-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoissonneriesListComponent implements OnInit {
  
  readonly store = inject(PoissonnerieStore);
  readonly authStore = inject(AuthStore);

  readonly selectedStatus = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL'); // <-- AJOUTÉ ICI

  readonly isSlideOverOpen = signal(false);
  readonly poissonnerieToEdit = signal<PoissonnerieResponse | null>(null);
  
  readonly isConfirmOpen = signal(false);
  readonly poissonnerieToDelete = signal<PoissonnerieResponse | null>(null);

  // <-- COMPUTED POUR LE FILTRE -->
  readonly filteredPoissonneries = computed(() => {
    const status = this.selectedStatus();
    const page = this.store.poissonneriesPage();
    const all = page?.content || [];
    
    if (status === 'ACTIVE') return all.filter(p => p.active);
    if (status === 'INACTIVE') return all.filter(p => !p.active);
    return all;
  });

  ngOnInit(): void {
    this.store.loadPoissonneries(0, 20);
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status as 'ALL' | 'ACTIVE' | 'INACTIVE');
  }

  openCreatePanel(): void {
    this.poissonnerieToEdit.set(null);
    this.isSlideOverOpen.set(true);
  }

  openEditPanel(poissonnerie: PoissonnerieResponse): void {
    this.poissonnerieToEdit.set(poissonnerie);
    this.isSlideOverOpen.set(true);
  }

  confirmDelete(poissonnerie: PoissonnerieResponse): void {
    this.poissonnerieToDelete.set(poissonnerie);
    this.isConfirmOpen.set(true);
  }

  async executeDelete() {
    if (this.poissonnerieToDelete()) {
      await this.store.deletePoissonnerie(this.poissonnerieToDelete()!.id);
      this.isConfirmOpen.set(false);
    }
  }

  async reactivatePoissonnerie(id: number) {
    await this.store.reactivatePoissonnerie(id);
  }

  async onSavePoissonnerie(data: any) {
    if (this.poissonnerieToEdit()) {
      await this.store.updatePoissonnerie(this.poissonnerieToEdit()!.id, data);
    } else {
      await this.store.createPoissonnerie(data);
    }
    this.isSlideOverOpen.set(false);
  }

  onPageChange(page: number): void {
    this.store.loadPoissonneries(page, 20);
  }
}