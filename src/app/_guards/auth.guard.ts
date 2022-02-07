import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../_models/user';
import { UserService } from '../_services/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private userService: UserService,
        public loader: LoadingBarService,
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

                        let rol: string = user.rol;
                        switch (rol) {
                            case 'admin':
                                if (user.isenabled) return true;
                                break;
                            case 'superadmin':
                                return true;
                            case 'worker':
                                if (user.isenabled) return true;
                                break;
                            case 'planner':
                                if (user.isenabled) return true;
                                break;
                            case 'company':
                                if (user.isenabled) return true;
                                break;
                            default:
                                return false;
                        }
                    }


                    // localStorage.removeItem('currentUser');
                    // localStorage.removeItem('dataCurrentUser');
                    // not logged in so redirect to login page with the return url
                    this.router.navigate(['/error/not-allowed'], { queryParams: { returnUrl: state.url } });

                    return false;

                })
            } catch (error) {
                console.log(error);
            }
        } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('dataCurrentUser');
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
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
