import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';
import { NotificationService } from '../_services/notification/notification.service';
import { UserService } from '../_services/user/user.service';
import { UserInterface } from '../_models/user';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    private rol: string;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        public authService: AuthService,
        private notifyService: NotificationService,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false]
        });

        /*if (localStorage.getItem('currentUser')) {
            this.authService.doLogout();
        }*/

        if (localStorage.getItem('remember')) {
            localStorage.removeItem('currentLayoutStyle');
            if (localStorage.getItem('dataCurrentUser')) {
                this.rol = JSON.parse(localStorage.getItem('dataCurrentUser')).rol;
            }
            let returnUrl = this.onLoginRedirect();
            this.router.navigate([returnUrl]);
        } else if (localStorage.getItem('currentUser')) {
            this.notifyService.showWarning('Existe una sesión activa, se procederá a cerrar la sesión...', 'Info');
            this.authService.doLogout();
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    tryLogin() {
        this.submitted = true;
        this.loading = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            this.loading = false;
            return;
        }
        const value = {
            email: this.f.email.value,
            password: this.f.password.value
        };
        this.authService.doLogin(value)
            .then(res => {
                if (this.f.rememberMe.value) {
                    localStorage.setItem('remember', 'true');
                } else {
                    localStorage.removeItem('remember');
                }

                let returnUrl = '';
                this.userService.getOneUser(res.user.uid).subscribe(user => {
                    this.setUserInStorage(res);
                    localStorage.removeItem('currentLayoutStyle');
                    if (user.rol === 'worker') {
                        returnUrl = '/harvest/harvests-view';
                        if (this.returnUrl) {
                            returnUrl = this.returnUrl;
                        }
                    } else {
                        returnUrl = '/dashboard/show-data';
                        if (this.returnUrl) {
                            returnUrl = this.returnUrl;
                        }
                    }
                    this.router.navigate([returnUrl]);
                });

            }, err => {
                this.submitted = false;
                this.loading = false;
                this.notifyService.showError("Error", "¡Usuario o contraseña incorrecta!");
            });
    }

    setUserInStorage(res) {
        if (res.user) {
            localStorage.setItem('currentUser', JSON.stringify(res.user));
        } else {
            localStorage.setItem('currentUser', JSON.stringify(res));
        }
    }

    onLoginRedirect() {
        if (this.rol === 'worker') {
            return '/harvest/harvests-view';
        } else {
            return '/dashboard/show-data';
        }

    }
}
