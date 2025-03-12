import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  console.log(localStorage.getItem('loggedIn'));

  if (localStorage.getItem('loggedIn') === 'true') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
