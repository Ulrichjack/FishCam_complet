export interface CreateEvaluationRequest {
  achatJournalierId: number;
  livreurId: number;
  qualiteProduit: number;
  respectPoids: number;
  commentaire?: string;
  problemeSignale: boolean;
}