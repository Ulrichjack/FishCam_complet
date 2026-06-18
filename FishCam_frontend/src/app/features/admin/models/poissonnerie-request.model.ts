export interface CreatePoissonnerieRequest {
  name: string;
  address: string;
  phone: string;
  pretActif: boolean;
  loyer: number;
  fondDeCaisseDefaut: number;
}

export interface UpdatePoissonnerieRequest {
  name?: string;
  address?: string;
  phone?: string;
  pretActif?: boolean;
  loyer?: number;
  fondDeCaisseDefaut?: number;
}