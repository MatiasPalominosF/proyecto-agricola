﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';
import { NotificationService } from '../_services/notification/notification.service';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        public authService: AuthService,
        private notifyService: NotificationService,
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

        console.log("localStorage.getItem('remember')", localStorage.getItem('remember'));
        if (localStorage.getItem('remember')) {
            localStorage.removeItem('currentLayoutStyle');
            let returnUrl = this.onLoginRedirect();
            this.router.navigate([returnUrl]);
        } else if (localStorage.getItem('currentUser')) {
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

                this.setUserInStorage(res);
                localStorage.removeItem('currentLayoutStyle');
                let returnUrl = '/dashboard/show-data';
                if (this.returnUrl) {
                    returnUrl = this.returnUrl;
                }
                console.log("returnUrl", returnUrl);
                this.router.navigate([returnUrl]);
            }, err => {
                this.submitted = false;
                this.loading = false;
                this.notifyService.showError("Error", "¡Usuario o contraseña incorrecta!");
                //this.alertService.error("Usuario o contraseña incorrecta");
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
        return '/dashboard/show-data';
    }
}
