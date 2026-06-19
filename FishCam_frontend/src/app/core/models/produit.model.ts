export interface ProduitResponse {
  id: number;
  nom: string;
  unite: string;
  poidsParCarton: number;
  actif: boolean;
  dernierMontantCarton?: number; // NOUVEAU
  dernierPrixVenteKilo?: number; // NOUVEAU
}
