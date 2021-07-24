import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';

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
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private authService: AuthService) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }


    tryRegister() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;

        this.authService.doRegister(this.registerForm.value)
        .then(res => {
            this.loading = false;
          console.log(res);
          this.errorMessage = '';
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        }, err => {
          console.log(err);
          this.loading = false;
          this.alertService.error(err.message);
        });
      }


}
