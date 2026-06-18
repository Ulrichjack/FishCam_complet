
export interface CreateProduitRequest  {
    nom: string
    unite:Unite;
    poidsParCarton: number;
}


export interface UpdateProduitRequest  {
    nom: string
    unite:Unite;
    poidsParCarton: number;
}

export enum Unite {
  KG = 'KG',
}