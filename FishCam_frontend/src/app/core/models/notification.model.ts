import { PoissonnerieResponse } from "./poissonnerie-response.model";

export interface NotificationResponse
{
  id: number;
  type: TypeNotification;
  message: string;
  read: boolean;
  poissonnerie: PoissonnerieResponse;
  createdAt: string;
}

export enum TypeNotification {
  COMPTE_COURANT_ALERTE = 'COMPTE_COURANT_ALERTE',
  COMPTE_SOLDE = 'COMPTE_SOLDE',
  RAPPORT_JOURNALIER = 'RAPPORT_JOURNALIER',
  INFO = 'INFO',
}
