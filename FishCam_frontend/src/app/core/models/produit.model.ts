export interface ProduitResponse {
  id: number;
  nom: string;
  unite: string;
  poidsParCarton: number;
  actif: boolean;
  prixUnitaireCarton?: number; // NOUVEAU
  dernierPrixVenteKilo?: number; // NOUVEAU
}
