import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInterface } from '../_models/user';
import { UserService } from '../_services/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private userService: UserService,
    ) { }

    /** TODO: SET LOCALSTORAGE WHEN I UPDATE STATE IN USERS */
    async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (localStorage.getItem('currentUser')) {
            try {
                return await this.userService.getUserToGuard(currentUser.uid).then(doc => {
                    if (doc.exists) {
                        let user: UserInterface = doc.data();
                        localStorage.setItem('dataCurrentUser', JSON.stringify(user));
                        if (user.isenabled) {
                            return true;
                        }
                    }
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('dataCurrentUser');
                    // not logged in so redirect to login page with the return url
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;

                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }

        localStorage.removeItem('currentUser');
        localStorage.removeItem('dataCurrentUser');
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
