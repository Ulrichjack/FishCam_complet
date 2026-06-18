export interface BilanMensuelResponse {
  id: number;
  mois: number;
  annee: number;
  poissonnerieId: number;
  genereParId: number;
  poissonnerieNom: string;
  genereParNom: string;
  totalAchatMois: number;
  totalVenteRealisee: number;
  totalVentePrevisibleMois: number;
  totalDepensesMois: number;
  beneficeNetMois: number;
  nombreJoursTravailles: number;
  meilleurJourBenefice: string;
  beneficeMeilleurJour: number;
  montantDettesMois: number;
  createdAt: string;
}

export interface ComparaisonBoutiquesResponse {
  bilans: BilanMensuelResponse[];
  totalVentesGlobal: number;
  totalAchatsGlobal: number;
  totalDepensesGlobal: number;
  beneficeNetGlobal: number;
  mois: number;
  annee: number;
}