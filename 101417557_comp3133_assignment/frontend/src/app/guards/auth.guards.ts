import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('Auth guard called for route:', state.url);
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    console.log('Auth guard: User is logged in');
    return true;
  } else {
    console.log('Auth guard: User is NOT logged in, redirecting to login');
    router.navigate(['/login']);
    return false;
  }
};