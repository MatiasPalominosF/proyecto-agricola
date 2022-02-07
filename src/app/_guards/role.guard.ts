import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole1 = route.data.expectedRole1;
    const expectedRole2 = route.data.expectedRole2;
    const expectedRole3 = route.data.expectedRole3;
    const expectedRole4 = route.data.expectedRole4;

    const data = JSON.parse(localStorage.getItem('dataCurrentUser'));
    if (localStorage.getItem('currentUser') == undefined) {
      // Not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      localStorage.removeItem('currentUser');
      localStorage.removeItem('dataCurrentUser');
      return false;
    } else if (data.rol !== expectedRole1 && data.rol !== expectedRole2 && data.rol !== expectedRole3 && data.rol !== expectedRole4) {
      console.log("Acceso no permitido");
      return false;
    }
    return true;
  }

}
