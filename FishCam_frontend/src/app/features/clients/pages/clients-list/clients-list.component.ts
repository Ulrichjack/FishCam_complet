import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ClientStore } from '../../stores/client.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { Form, LucideAngularModule } from 'lucide-angular';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { SlideOverPanelComponent } from '../../../../shared/components/slide-over-panel/slide-over-panel.component';
import { ClientFormComponent } from "../../components/client-form/client-form.component";
import { RouterLink } from '@angular/router';
import { ClientResponse } from '../../../../core/models/compte-courant.model';
import { ConfirmDialogComponent } from "../../../../shared/components/confirm-dialog/confirm-dialog.component";
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [LucideAngularModule, StatusBadgeComponent, 
    SlideOverPanelComponent, ClientFormComponent, 
    RouterLink, ConfirmDialogComponent,FormsModule,
    LoadingSkeletonComponent, EmptyStateComponent, ErrorStateComponent ],
  templateUrl: './clients-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsListComponent implements OnInit {


  readonly clientStore = inject(ClientStore);
  readonly authStore = inject(AuthStore);


  isSlideOverOpen = signal<boolean>(false);
  isConfirmOpen = signal<boolean>(false);
  clientToDelete = signal<ClientResponse | null>(null);
  clientToEdit = signal<ClientResponse | null>(null);
  pageSize = signal<number>(20);

  private searchTimeout: any;


  ngOnInit(): void {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.clientStore.loadClients(poissonnerieId, 0);
    }
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
        this.clientStore.loadClients(poissonnerieId, 0);
      } else {
        this.clientStore.searchClients(poissonnerieId, searchTerm, 0);
      }
    }, 500); // Wait for 500ms after the user stops typing
  }

  async onSaveClient(clientData: any){
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (!poissonnerieId) return;

    const currentClient = this.clientToEdit();

    try {
      if (currentClient) {
        // EDIT MODE
        await this.clientStore.updateClient(currentClient.id, clientData);
      } else {
        // CREATE MODE
        const requestData = { ...clientData, poissonnerieId };
        await this.clientStore.createClient(requestData);
      }
      this.isSlideOverOpen.set(false);
    } catch (error) {
      console.error('Erreur lors de la création du client. Veuillez réessayer.', error);
    }

  }

  confirmDelete(client: ClientResponse) {
    this.clientToDelete.set(client);
    this.isConfirmOpen.set(true);
  }

  async executeDelete() {
    const client = this.clientToDelete();
    if (!client) return;

    try {
      await this.clientStore.deleteClient(client.id);
      this.isConfirmOpen.set(false);
    } catch (error) {
      console.error('Delete failed', error);
    }
  }


  openCreatePanel() {
    // On force un changement d'état pour déclencher l'effect du formulaire
    this.clientToEdit.set({ id: -1 } as any); // Hack temporaire pour forcer le changement
    setTimeout(() => {
      this.clientToEdit.set(null); // Le vrai reset
      this.isSlideOverOpen.set(true);
    }, 0);
  }

  openEditPanel(client: ClientResponse) {
    this.clientToEdit.set(client); // Pass the client data to the form
    this.isSlideOverOpen.set(true);
  }


  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const showInactive = selectElement.value === 'inactive';
    const poissonnerieId = this.authStore.activePoissonnerieId();

    if (poissonnerieId) {
      this.clientStore.toggleFilter(poissonnerieId, showInactive);
    }
  }

  async reactivateClient(id: number) {
    try {
      await this.clientStore.reactivateClient(id);
    } catch (error) {
      console.error('Reactivation failed', error);
    }
  }

  onPageSizeChange(newSize: string) {
  this.pageSize.set(Number(newSize));
  const poissonnerieId = this.authStore.activePoissonnerieId();
  if (poissonnerieId) {
    // On recharge la page 0 avec la nouvelle taille
    this.clientStore.loadClients(poissonnerieId, 0, this.pageSize());
  }
}



  previousPage(): void {
    const pId = this.authStore.activePoissonnerieId();
    const currentPage = this.clientStore.clientsPage()?.page?.number ?? this.clientStore.clientsPage()?.number ?? 0;
    
    if (pId) {
      this.clientStore.loadClients(pId, currentPage - 1, this.pageSize());
    }
  }

  nextPage(): void {
    const pId = this.authStore.activePoissonnerieId();
    const currentPage = this.clientStore.clientsPage()?.page?.number ?? this.clientStore.clientsPage()?.number ?? 0;
    
    if (pId) {
      this.clientStore.loadClients(pId, currentPage + 1, this.pageSize());
    }
  }

  



}
