import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { ClientResponse } from '../../../core/models/compte-courant.model';
import { CreateClientRequest, UpdateClientRequest } from '../models/client-request.model';
import { ClientDetailResponse } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clients`;
  private readonly ccUrl = `${environment.apiUrl}/comptes-courants`;
  private readonly epargneUrl = `${environment.apiUrl}/epargnes`;


   // Fetch paginated clients for a specific poissonnerie
  getClients(poissonnerieId: number, page: number = 0, size: number = 10) {
    return this.http.get<ApiResponse<PageResponse<ClientResponse>>>(
      `${this.apiUrl}/poissonnerie/${poissonnerieId}?page=${page}&size=${size}`
    );
  }

  // Search clients by name or phone
  searchClients(poissonnerieId: number, term: string, page: number = 0, size: number = 10) {
    return this.http.get<ApiResponse<PageResponse<ClientResponse>>>(
      `${this.apiUrl}/search?poissonnerieId=${poissonnerieId}&term=${term}&page=${page}&size=${size}`
    );
  }

  createClient(data: CreateClientRequest){
    return this.http.post<ApiResponse<ClientResponse>>(`${this.apiUrl}`, data);
  }

  getClientDetail(clientId: number) {
    return this.http.get<ApiResponse<ClientDetailResponse>>(`${this.apiUrl}/${clientId}`);
  }

  enregistrerEmprunt(data:{compteCourantId: number, montant: number, description?: string}){
    return this.http.post<ApiResponse<void>>(`${this.ccUrl}/emprunts`, data);
  }

  enregistrerRemboursement(data:{compteCourantId: number, montant: number, description?: string}){
    return this.http.post<ApiResponse<void>>(`${this.ccUrl}/remboursements`, data);
  }

  faireDepot(data:{epargneId: number, amount: number}){
    return this.http.post<ApiResponse<void>>(`${this.epargneUrl}/depot`, data);
  }

  faireRetrait(data:{epargneId: number, amount: number}){
    return this.http.post<ApiResponse<void>>(`${this.epargneUrl}/retrait`, data);
  }


  createCompteCourant(clientId: number) {
    return this.http.post<ApiResponse<any>>(`${this.ccUrl}/client/${clientId}`, {});
  }

  createEpargne(clientId: number) {
    // Note: Your backend CreateEpargneRequest requires an initialAmount. We will send 0.
    return this.http.post<ApiResponse<any>>(`${this.epargneUrl}`, { clientId: clientId, initialAmount: 0 });
  }

  modifierLimiteCredit(data:{compteCourantId: number, nouvelleLimite: number}){
    return this.http.put<ApiResponse<void>>(`${this.ccUrl}/${data.compteCourantId}/limite-credit`, { nouvelleLimit: data.nouvelleLimite });
  }

  deleteClient(clientId: number){
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${clientId}`);
  }

  updateClient(clientId: number, data: Partial<UpdateClientRequest>){
    return this.http.put<ApiResponse<ClientResponse>>(`${this.apiUrl}/${clientId}`, data);
  }

  getInactiveClients(poissonnerieId: number, page: number = 0, size: number = 10) {
    return this.http.get<ApiResponse<PageResponse<ClientResponse>>>(
      `${this.apiUrl}/inactive/poissonnerie/${poissonnerieId}?page=${page}&size=${size}`
    );
  }

  reactivateClient(clientId: number) {
    return this.http.patch<ApiResponse<ClientResponse>>(`${this.apiUrl}/${clientId}/reactivate`, {});
  }
}
