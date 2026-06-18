
export interface CreateLivreurRequest {
  nom: string;
  prenom: string;
  telephone: string;
  fournisseurId: number;
}


export interface UpdateLivreurRequest {
  nom?: string;
  prenom?: string;
  telephone?: string;
  fournisseurId?: number;
}