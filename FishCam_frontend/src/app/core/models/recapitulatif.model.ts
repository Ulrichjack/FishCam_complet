export interface RecapitulatifLigneResponse {
  jour: string;
  achat: number;
  prevu: number;
  realise: number;
  depenses: number;
  benefice: number;
}

export interface RecapitulatifResponse {
  lignes: RecapitulatifLigneResponse[];
  totalAchat: number;
  totalPrevu: number;
  totalRealise: number;
  totalDepenses: number;
  totalBenefice: number;
}