import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../stores/auth.store';
import { ToastService } from '../services/toast.service'; // <-- AJOUT

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
   const authStore = inject(AuthStore);
   const router = inject(Router);
   const toastService = inject(ToastService); // <-- AJOUT

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Une erreur est survenue';

      switch (error.status) {
        case 401:
          message = 'Session expirée, veuillez vous reconnecter.';
          authStore.logout();
          router.navigate(['/login']);
          break;
        case 403:
          message = 'Accès refusé. Vous n\'avez pas les droits.';
          break;
        case 404:
          message = 'Ressource introuvable (404).';
          break;
        case 400:
        case 409:
        case 422:
          message = error.error?.message || error.message || "Données invalides.";
          break;
        case 500:
          message = 'Erreur serveur (500). Réessayez plus tard.';
          break;
        case 0:
          message = 'Connexion impossible au serveur.';
          break;
      }

      toastService.error(message); // <-- AFFICHE LE TOAST D'ERREUR !
      return throwError(() => error);
    })
  );
};