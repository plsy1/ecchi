import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);


  if (localStorage.getItem('loggedIn') === 'true') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};


// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { CommonService } from '../common.service';
// import { map, catchError, of } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const commonService = inject(CommonService);

//   if (localStorage.getItem('loggedIn') !== 'true') {
//     router.navigate(['/login']);
//     return false;
//   }

//   return commonService.verifyTokenExpiration().pipe(
//     map((isValid) => {
//       if (isValid) {
//         return true;
//       } else {
//         router.navigate(['/login']);
//         return false;
//       }
//     }),
//     catchError(() => {
//       router.navigate(['/login']);
//       return of(false);
//     })
//   );
// };
