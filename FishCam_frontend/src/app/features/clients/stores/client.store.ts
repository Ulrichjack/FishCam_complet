import { TransactionMode } from '../../../shared/components/transaction-form/transaction-form.component';
import { Injectable, inject, signal } from '@angular/core';
import { PageResponse } from '../../../core/models/api-response.model';
import { ClientResponse, CompteCourantDetailResponse } from '../../../core/models/compte-courant.model';
import { firstValueFrom } from 'rxjs';
import { ClientService } from '../services/client.service';
import { CreateClientRequest } from '../models/client-request.model';
import { ClientDetailResponse } from '../models/client.model';
import { CompteCourantService } from '../services/compte-courant.service';
import { EpargneService } from '../services/epargne.service';
import { ExportService } from '../../../shared/pipes/services/export.service';
import { EpargneDetailResponse } from '../../../core/models/epargne.model';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ClientStore {
  private readonly clientService = inject(ClientService);
  private readonly compteCourantService = inject(CompteCourantService);
  private readonly epargneService = inject(EpargneService);
  private readonly exportService = inject(ExportService);
  private readonly toastService = inject(ToastService);

  // --- STATE SIGNALS ---
  private readonly _clientsPage = signal<PageResponse<ClientResponse> | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentSearchTerm = signal<string>('');
  private readonly _selectedClient = signal<ClientDetailResponse | null>(null);
  private readonly _showInactive = signal<boolean>(false);
  private readonly _compteCourantDetail = signal<CompteCourantDetailResponse | null>(null);
  private readonly _epargneDetail = signal<EpargneDetailResponse | null>(null);
  private readonly _isHistoryLoading = signal<boolean>(false); 

  // --- READONLY SIGNALS ---
  readonly clientsPage = this._clientsPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentSearchTerm = this._currentSearchTerm.asReadonly();
  readonly selectedClient = this._selectedClient.asReadonly();
  readonly showInactive = this._showInactive.asReadonly();
  readonly compteCourantDetail = this._compteCourantDetail.asReadonly();
  readonly epargneDetail = this._epargneDetail.asReadonly();
  readonly isHistoryLoading = this._isHistoryLoading.asReadonly();

  // --- ACTIONS ---
  async loadClients(poissonnerieId: number, page: number = 0, size: number = 20) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.clientService.getClients(poissonnerieId, page, size));
      this._clientsPage.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des clients. Veuillez réessayer.');
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadClientDetail(clientId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    this._selectedClient.set(null);

    try {
      const response = await firstValueFrom(this.clientService.getClientDetail(clientId));
      this._selectedClient.set(response.data);
    } catch (err) {
      this._error.set('Failed to load client details.');
    } finally {
      this._isLoading.set(false);
    }
  }

  //search Clients
  async searchClients(poissonnerieId:number, term: string, page: number = 0){
    this._isLoading.set(true);
    this._error.set(null);
    this._currentSearchTerm.set(term);

    try{
      const response  = await firstValueFrom(this.clientService.searchClients(poissonnerieId, term, page));
      this._clientsPage.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors de la recherche de clients. Veuillez réessayer.');
    } finally {
      this._isLoading.set(false);
    }
  }

  async createClient(data: CreateClientRequest){
    this._isLoading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(this.clientService.createClient(data));
      await this.loadClients(data.poissonnerieId, 0);
      this.toastService.success('Client créé avec succès !');

    } catch (err){
      this._error.set('Erreur lors de la création du client. Veuillez réessayer.');
    } finally {
      this._isLoading.set(false);
    }

  }

  async executeTransaction(action: TransactionMode, amount: number, notes: string | undefined){
     const client = this._selectedClient();
     if(!client) return;

     this._isLoading.set(true);
     this._error.set(null);

     try {
      switch (action){
        case 'emprunt':
          await firstValueFrom(this.clientService.enregistrerEmprunt({compteCourantId: client.compteCourantId, montant: amount, description: notes}));
          break;

        case 'remboursement':
          await firstValueFrom(this.clientService.enregistrerRemboursement({compteCourantId: client.compteCourantId, montant: amount, description: notes} as any));
          break;

        case 'depot':
          await firstValueFrom(this.clientService.faireDepot({epargneId: client.epargneId, amount}));
          break;

        case 'retrait':
          await firstValueFrom(this.clientService.faireRetrait({epargneId: client.epargneId, amount}));
          break;
      }
      await this.loadClientDetail(client.id);
      this.toastService.success('Transaction enregistrée avec succès !');
    }catch (err){
      this._error.set('Erreur lors de la transaction. Veuillez réessayer.');
      throw err;
    } finally{
      this._isLoading.set(false);
     }

  }


  async openCompteCourant() {
    const client = this._selectedClient();
    if (!client) return;
    this._isLoading.set(true);
    try {
      await firstValueFrom(this.clientService.createCompteCourant(client.id));
      await this.loadClientDetail(client.id); // Refresh the page!
      this.toastService.success('Compte courant ouvert avec succès !');
    } catch (err) {
      console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }

  async openEpargne() {
    const client = this._selectedClient();
    if (!client) return;
    this._isLoading.set(true);
    try {
      await firstValueFrom(this.clientService.createEpargne(client.id));
      await this.loadClientDetail(client.id); // Refresh the page!
      this.toastService.success('Compte épargne ouvert avec succès !');
    } catch (err) {
      console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }


  async modifierLimite(nouvelleLimite: number) {
    const client = this._selectedClient();
    if (!client || !client.compteCourantId) return;

    this._isLoading.set(true);
    try {
      // Call the service method (you might need to create this in ClientService!)
      await firstValueFrom(this.clientService.modifierLimiteCredit({
          compteCourantId: client.compteCourantId,
          nouvelleLimite: nouvelleLimite
        }));
        this.toastService.success('Limite de crédit modifiée !');
      } finally {
        this._isLoading.set(false);
      }
  }


  async deleteClient(clientId: number){
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clientService.deleteClient(clientId));

      // Reload the current page of clients!
      const currentPage = this.clientsPage();
      if (currentPage && currentPage.content.length > 0) {
        // We assume all clients on the page belong to the same poissonnerie
        const poissonnerieId = currentPage.content[0].poissonnerie.id;
        await this.loadClients(poissonnerieId, currentPage.number);
        this.toastService.success('Client désactivé avec succès !');
      }
    } catch (err){
      this._error.set('Erreur lors de la désactivation du client.');
      throw err; // Important to throw so the UI knows it failed
    } finally {
      this._isLoading.set(false);
    }
  }

  async updateClient(clientId: number, data: any){
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clientService.updateClient(clientId, data));

      // Reload the current page of clients!
      const currentPage = this.clientsPage();
      if (currentPage && currentPage.content.length > 0) {
        const poissonnerieId = currentPage.content[0].poissonnerie.id;
        await this.loadClients(poissonnerieId, currentPage.number);
        this.toastService.success('Client modifié avec succès !');
      }
    } catch (err){
      this._error.set('Erreur lors de la mise à jour du client.');
      throw err;
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadInactiveClients(poissonnerieId: number, page: number = 0) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      // DIRECTIVE: Call the service and update the signal
      const response = await firstValueFrom(this.clientService.getInactiveClients(poissonnerieId, page));
      this._clientsPage.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des clients inactifs.');
    } finally {
      this._isLoading.set(false);
    }
  }

  // Add this method to toggle the filter
  toggleFilter(poissonnerieId: number, showInactive: boolean) {
    this._showInactive.set(showInactive);
    if (showInactive) {
      this.loadInactiveClients(poissonnerieId, 0);
    } else {
      this.loadClients(poissonnerieId, 0);
    }
  }

  async reactivateClient(clientId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clientService.reactivateClient(clientId));

      // Reload the current page
      const currentPage = this.clientsPage();
      if (currentPage && currentPage.content.length > 0) {
        const poissonnerieId = currentPage.content[0].poissonnerie.id;
        // If we are looking at inactive clients, reload the inactive list
        if (this._showInactive()) {
          await this.loadInactiveClients(poissonnerieId, currentPage.number);
        } else {
          await this.loadClients(poissonnerieId, currentPage.number);
        }
         this.toastService.success('Client réactivé avec succès !');
      }
    } catch (err) {
      this._error.set('Erreur lors de la réactivation du client.');
      throw err;
    } finally {
      this._isLoading.set(false);
    }
  }


  // DIRECTIVE: 
  // 1. Set _isHistoryLoading à true, _error à null
  // 2. Appelle compteCourantService.getCompteCourantDetail(compteId)
  // 3. Met à jour _compteCourantDetail avec response.data
  // 4. Gère le catch (erreur) et le finally (loading false)
  async loadCompteCourantDetail(compteId: number) {
    // YOUR CODE HERE
    this._isHistoryLoading.set(true);
    this._error.set(null);
    
    try {
      const response = await firstValueFrom(this.compteCourantService.getCompteCourantDetail(compteId));
      this._compteCourantDetail.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors du chargement du compte courant. Veuillez réessayer.');
    } finally {
      this._isHistoryLoading.set(false);
    }
  }

  // DIRECTIVE: 
  // 1. Set _isHistoryLoading à true, _error à null
  // 2. Appelle epargneService.getEpargneDetail(epargneId)
  // 3. Met à jour _epargneDetail avec response.data
  // 4. Gère le catch (erreur) et le finally (loading false)
  async loadEpargneDetail(epargneId: number) {
    // YOUR CODE HERE
    this._isHistoryLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.epargneService.getEpargneDetail(epargneId));
      this._epargneDetail.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors du chargement de l’épargne. Veuillez réessayer.');
    } finally {
      this._isHistoryLoading.set(false);
    }
  }

  // DIRECTIVE: 
  // 1. Appelle exportService.downloadEpargnePdf(epargneId)
  // 2. Récupère le Blob
  // 3. Crée une URL locale avec : const url = window.URL.createObjectURL(blob);
  // 4. Crée un élément <a> invisible, set son href à l'url, son download à 'fiche_epargne.pdf'
  // 5. Simule un clic : a.click()
  // 6. Nettoie l'URL : window.URL.revokeObjectURL(url);
  async downloadEpargnePdf(epargneId: number) {
    // YOUR CODE HERE
    const epargne = this._epargneDetail();
    if (!epargne) {
      this._error.set('Détails de l’épargne non chargés. Veuillez réessayer.');
      return;
    }
    try {
      const blob = await firstValueFrom(this.exportService.downloadEpargnePdf(epargneId));
      const url = window.URL.createObjectURL(blob);
      
      const cleanClient = epargne.client.lastName.replace(/[^a-zA-Z0-9]/g, '_') + ' ' + epargne.client.firstName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `fiche_epargne_${cleanClient}_${epargne.createdAt}.pdf`;
      
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      this._error.set('Erreur lors du téléchargement du PDF. Veuillez réessayer.');
    }
  }



}
