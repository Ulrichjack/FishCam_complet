
export interface CreateLigneRequest {
  produitId: number;
  quantiteCartons: number;
  prixUnitaireCarton: number;
  poidsKg: number;
  prixVenteKilo: number;
}


export interface DernierPrixResponse{
  poidsParCarton: number;
  montantCarton: number;
  prixVenteKilo: number;
  ancienMontantCarton: number;
  difference: number;
  fluctuation: TypeFluctuation;

}

export enum TypeFluctuation{
  HAUSSE = 'HAUSSE',
  BAISSE = 'BAISSE',
  STABLE = 'STABLE',
  NOUVEAU = 'NOUVEAU'
}

export interface LigneAchatResponse{
  id: number;
  produitId: number;
  produitNom: string;
  quantiteCartons: number;
  poidsKg: number;
  prixUnitaireCarton: number;
  montantCarton: number;
  prixVenteKilo: number;
  prixAchatKilo:number;
  prixVenteTotal:number;
  margeKilo: number;
  margeTotal: number;
}