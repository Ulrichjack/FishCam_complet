import { LigneAchatResponse } from "./facture-request.model";

export interface FactureResponse {
   id:number;
   poissonnerieId: number;
   fournisseurId: number;
   enregistreParId: number;
   dateAchat: string;
   poissonnerieNom: string;
   fournisseurNom: string;
   enregistreParNom: string;
   cloture: boolean;
   createdAt: string;
   totalAchat?: number;
}


export interface CreateFactureRequest{
  poissonnerieId: number;
  fournisseurId: number;
  dateAchat: string;
}


export interface FactureDetailResponse {
   id:number;
   poissonnerieId: number;
   poissonnerieNom: string;
   fournisseurId: number;
   fournisseurNom: string;
   enregistreParId: number;
   enregistreParNom: string;
   dateAchat: string;
   cloture: boolean;
   totalAchat: number;
   totalVente: number;
   margeTotal: number;
   ligneAchatResponses: LigneAchatResponse[];
   createdAt: string;
   
}
