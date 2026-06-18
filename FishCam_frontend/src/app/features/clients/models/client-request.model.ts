export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  phone: string;
  cni?: string;
  address?: string;
  quartier?: string;
  dateOfBirth?: string;
  poissonnerieId: number;
}


export interface UpdateClientRequest {
  firstName: string;
  lastName: string;
  phone: string;
  cni?: string;
  address?: string;
  quartier?: string;
  dateOfBirth?: string;
}
