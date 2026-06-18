import { UserResponse } from "./user.model";

export interface TransactionGlobalResponse{
  id: string;
  dateHeure: string;
  clientNom: string;
  clientTelephone: string;
  type: 'EMPRUNT' | 'REMBOURSEMENT' | 'DEPOT' | 'RETRAIT';
  montant: number;
}


export interface TransactionCCResponse {
  id: number;
  type: TypeTransaction;
  montant: number;
  soldePrecedent: number;
  soldeApres: number;
  description: string;
  effectuePar: UserResponse;
  transactionDate: string;
  notes:string;
}



export enum TypeTransaction{
  EMPRUNT = 'EMPRUNT',
  REMBOURSEMENT = 'REMBOURSEMENT'
}