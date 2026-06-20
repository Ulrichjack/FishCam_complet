import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs'; // <-- AJOUTE timeout et TimeoutError
import { AuthStore } from '../stores/auth.store';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
   const authStore = inject(AuthStore);
   const router = inject(Router);
   const toastService = inject(ToastService);

  return next(req).pipe(
    timeout(10000), // <-- NOUVEAU : Si pas de réponse après 10 secondes, on déclenche une erreur
    catchError((error: any) => {

       if (req.url.includes('/backup/sync-cloud')) {
        return throwError(() => error);
      }
      
      let message = 'Une erreur est survenue';

      // NOUVEAU : Gestion spécifique du Timeout
      if (error instanceof TimeoutError) {
        message = 'Le serveur met trop de temps à répondre. Vérifiez votre connexion.';
        toastService.error(message);
        return throwError(() => error);
      }

      if (error instanceof HttpErrorResponse) {
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
            message = 'Connexion impossible au serveur. Vérifiez votre réseau.';
            break;
        }
      }

      toastService.error(message);
      return throwError(() => error);
    })
  );
};
