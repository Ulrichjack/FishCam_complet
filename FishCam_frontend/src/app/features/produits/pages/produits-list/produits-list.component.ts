import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ProduitStore } from '../../stores/produit.store';
import { ProduitResponse } from '../../../../core/models/produit.model';
import { SlideOverPanelComponent } from '../../../../shared/components/slide-over-panel/slide-over-panel.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProduitFormComponent } from '../../components/produit-form/produit-form.component';
import { FormsModule } from '@angular/forms'; // <-- TRÈS IMPORTANT POUR LE FILTRE

@Component({
  selector: 'app-produits-list',
  standalone: true,
  imports: [
    LucideAngularModule, 
    SlideOverPanelComponent, 
    ConfirmDialogComponent, 
    ProduitFormComponent,
    FormsModule // <-- AJOUTÉ ICI
  ],
  templateUrl: './produits-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProduitsListComponent implements OnInit {

  private searchTimeout: any;
  readonly store = inject(ProduitStore);
  
  readonly selectedStatus = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  readonly isSlideOverOpen = signal<boolean>(false);
  readonly isConfirmOpen = signal<boolean>(false);
  readonly produitToEdit = signal<ProduitResponse | null>(null);
  readonly produitToDelete = signal<ProduitResponse | null>(null);

  // CORRECTION DU BUG ICI 👇
  readonly filteredProduits = computed(() => {
    const status = this.selectedStatus();
    const page = this.store.produitsPage();
    
    // On extrait le tableau 'content'. S'il n'y a rien, on prend un tableau vide []
    const all = page?.content || []; 
    
    if (status === 'ACTIVE') return all.filter(p => p.actif);
    if (status === 'INACTIVE') return all.filter(p => !p.actif);
    return all;
  });

  ngOnInit(): void {
    this.store.loadProduits(0);
  }

  openCreatePanel() {
    this.produitToEdit.set(null);
    this.isSlideOverOpen.set(true);
  }

  openEditPanel(produit: ProduitResponse) {
    this.produitToEdit.set(produit);
    this.isSlideOverOpen.set(true);
  }

  async onSaveProduit(data: any) {
    if (this.produitToEdit()) {
      await this.store.updateProduit(this.produitToEdit()!.id, data);
    } else {
      await this.store.createProduit(data);
    }
    this.isSlideOverOpen.set(false);
  }

  confirmDelete(produit: ProduitResponse) {
    this.produitToDelete.set(produit);
    this.isConfirmOpen.set(true);
  }

  async executeDelete() {
    if (this.produitToDelete()) {
      await this.store.deleteProduit(this.produitToDelete()!.id);
      this.isConfirmOpen.set(false);
    }
  }

  previousPage() {
    const currentPage = this.store.produitsPage()?.page?.number ?? this.store.produitsPage()?.number ?? 0;
    this.store.loadProduits(currentPage - 1);
  }

  nextPage() {
    const currentPage = this.store.produitsPage()?.page?.number ?? this.store.produitsPage()?.number ?? 0;
    this.store.loadProduits(currentPage + 1);
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (searchTerm.trim() === '') {
        this.store.loadProduits(0);
      } else {
        this.store.searchProduits(searchTerm);
      }
    }, 500);
  }

  async reactivateProduit(id: number) { 
    try {
      await this.store.reactivateProduit(id);
    } catch (error) {
      console.error("Erreur lors de la réactivation du produit:", error);
    }
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status as 'ALL' | 'ACTIVE' | 'INACTIVE');
  }
}