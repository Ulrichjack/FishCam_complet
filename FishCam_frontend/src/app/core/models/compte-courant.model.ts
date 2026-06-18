import { PoissonnerieResponse } from "./poissonnerie-response.model";
import { TransactionCCResponse } from "./transaction.model";

export enum StatutCompteCourant {
  ACTIF = 'ACTIF',
  EN_DETTE = 'EN_DETTE',
  BLOQUE = 'BLOQUE'
}

export enum TypeTransaction {
  EMPRUNT = 'EMPRUNT',
  REMBOURSEMENT = 'REMBOURSEMENT'
}

export interface ClientResponse {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  quartier: string;
  poissonnerie: PoissonnerieResponse;
  active: boolean;
  createdAt: string;
  soldeCompteCourant?: number;
}

export interface CompteCourantResponse {
  id: number;
  client: ClientResponse;
  solde: number;
  limiteCreditMax: number;
  statut: StatutCompteCourant;
  dateOuverture: string;
  updatedAt: string;
}

export interface CompteCourantDetailResponse {
  id: number;
  client: ClientResponse;
  solde: number;
  limiteCredit: number;
  statut: string;
  dateOuverture: string;
  updatedAt: string;
  transactions: TransactionCCResponse[];
  nombreTransactions: number;
  totalEmprunts: number;
  totalRemboursements: number;
}