export interface PreparationClotureResponse {
  fondDeCaisseDefaut: number;
  montantDettesJour: number;
  montantRembourseJour: number;
  nombreDettesJour: number;
  totalAchat: number;
  totalVentePrevisible: number;
  facturesNonCloturees: number;
}

export interface ClotureJournaliereRequest {
  date: string;
  poissonnerieId: number;
  argentCaisse: number;
  fondDeCaisse: number;
  transport?: number;
  ration?: number;
  autresFrais?: number;
  descriptionAutres?: string;
}

export interface ClotureJournaliereResponse {
  id: number;
  date: string;
  poissonnerieId: number;
  clotureParId: number;
  poissonnerieNom: string;
  clotureParNom: string;
  ecartVente: number;
  descriptionAutres: string;
  totalAchat: number;
  totalVentePrevisible: number;
  montantDettesJour: number;
  montantRembourseJour: number;
  nombreDettesJour: number;
  argentCaisse: number;
  fondDeCaisse: number;
  transport: number;
  ration: number;
  autresFrais: number;
  venteRealisee: number;
  totalDepenses: number;
  beneficeNet: number;
  createdAt: string;
}