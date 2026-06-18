import { PoissonnerieResponse } from "../../../core/models/poissonnerie-response.model";

export interface ClientDetailResponse {
  id: number;
  compteCourantId: number; // <-- ADD THIS
  epargneId: number;
  firstName: string;
  lastName: string;
  phone: string;
  cni: string;
  address: string;
  quartier: string;
  dateOfBirth: string;
  notes: string;
  poissonnerie: PoissonnerieResponse;
  active: boolean;
  soldeCompteCourant: number | null;
  soldeEpargne: number | null ;
  limiteCredit: number | null;       // <-- AJOUTÉ
  statutCompteCourant: string | null;
  createdAt: string;
  updatedAt: string;
}


