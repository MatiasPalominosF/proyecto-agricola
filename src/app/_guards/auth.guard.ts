import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInterface } from '../_models/user';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router) { }

    /** TODO: SET LOCALSTORAGE WHEN I UPDATE STATE IN USERS */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (localStorage.getItem('currentUser')) {
            if (localStorage.getItem('dataCurrentUser')) {
                let data: UserInterface = JSON.parse(localStorage.getItem('dataCurrentUser'));
                console.table(data)
                if (data.isenabled) {
                    console.log("Activo");
                    // logged in so return true
                    return true;
                }
            }
        }

        //localStorage.removeItem('currentUser');
        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        console.log("Desactivado");
        return false;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }

        localStorage.removeItem('currentUser');
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
