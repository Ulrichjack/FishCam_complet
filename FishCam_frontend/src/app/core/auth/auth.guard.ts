import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const authGuard: CanActivateFn = (route, state) => {

  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isLoggedIn = authStore.isLoggedIn();
  const isGoingToLogin = state.url === '/login';

  // CASE A: Logged in AND trying to go to login page
  if (isLoggedIn && isGoingToLogin) {
    router.navigate(['/dashboard']);
    return false;
  }

  // CASE B: Logged in and going anywhere else
  if (isLoggedIn) {
    return true;
  }

  // CASE C: Not logged in AND trying to go to login page
  if ( !isLoggedIn && isGoingToLogin){
    return true;
  }

  // CASE D: Not logged in and going anywhere else
  router.navigate(['/login']);
  return false;
};
