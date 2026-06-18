import { ClientResponse } from './compte-courant.model';
import { UserResponse } from './user.model';

export interface TransactionEpargneResponse {
  id: number;
  type: 'DEPOT' | 'RETRAIT';
  amount: number;
  transactionDate: string;
  effectuePar: UserResponse;
  notes?: string;
}

export interface EpargneDetailResponse {
  id: number;
  client: ClientResponse;
  currentBalance: number;
  createdAt: string;
  transactions: TransactionEpargneResponse[];
  createdBy: UserResponse;
  nombreTransactions: number;
  totalDepots: number;
  totalRetraits: number;
}