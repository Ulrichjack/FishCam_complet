export interface EvaluationLivreurResponse {
  id: number;
  dateEvaluation: string;
  qualiteProduit: number;
  respectPoids: number;
  commentaire: string;
  problemeSignale: boolean;
  livreurId: number;
  livreurNom: string;
  livreurPrenom: string;
  evaluatorNom: string;
}