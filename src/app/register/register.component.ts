import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user/user.service';
import * as firebase from 'firebase/app';
import { NotificationService } from '../_services/notification/notification.service';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    errorMessage = '';
    successMessage = '';
    user = {};
    users = [];
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private authService: AuthService,
        private userService: UserService,
        private notifyService: NotificationService,
    ) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            run: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.userService.getUsers().subscribe(users => {
            this.users = users.map(item => {
                return {
                    ...item.payload.doc.data() as {},
                    id: item.payload.doc.id
                };
            });
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registerForm.controls;
    }

    get fValue() {
        return this.registerForm.value;
    }


    tryRegister() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;

        this.authService.doRegister(this.registerForm.value)
            .then(res => {
                this.loading = false;
                this.user = {
                    firstName: this.fValue.firstName,
                    run: this.fValue.run,
                    email: this.fValue.email,
                    password: this.fValue.password,
                    uid: res.user.uid
                };
                //console.log(res);
                this.errorMessage = '';
                const currentUser = firebase.auth().currentUser;
                currentUser.updateProfile({
                    displayName: this.fValue.firstName
                }).then(user => {
                    //console.log(user, 'user succesfull update');
                }, err => {
                    console.log(err);
                });
                this.notifyService.showSuccess("Registro", "¡Registrado correctamente!");
                //this.alertService.success('Registro correcto', true);
                if (this.users.length === 0) {
                    this.userService.createUser(this.user).then(user => {
                        console.log(user);
                    });
                } else if (this.users.length !== 0) {
                    for (let i = 0; i < this.users.length; i++) {
                        if (this.users[i].uid !== res.user.uid) {
                            this.userService.createUser(this.user).then(user => {
                                //console.log(user);
                            });
                            break;
                        } else {
                            console.log('error');
                        }
                    }
                } else {
                    console.log('error');
                }
                this.router.navigate(['/login']);
            }, err => {
                console.log(err);
                this.loading = false;

                this.notifyService.showError("Error", err.message);
                //this.alertService.error(err.message);
            });
    }


}
