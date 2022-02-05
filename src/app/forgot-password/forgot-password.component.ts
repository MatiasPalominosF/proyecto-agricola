import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../_services/auth.service";
import { NotificationService } from "../_services/notification/notification.service";

@Component({
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    public submitted: boolean = false;
    public recoveryForm: FormGroup;
    public loading: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private notifyService: NotificationService,
        private router: Router,
    ) {

    }

    ngOnInit(): void {
        this.recoveryForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        });
    }

    get f() {
        return this.recoveryForm.controls;
    }

    get fValue() {
        return this.recoveryForm.value;
    }

    onRecoverySubmit() {
        this.submitted = true;

        if (this.recoveryForm.invalid) {
            return;
        }
        this.loading = true;
        this.authService.recoverPassword(this.fValue.email).then(
            () => {
                this.loading = false;
                this.notifyService.showSuccess('Email enviado correctamente', 'Recuperar contraseña');
                this.recoveryForm.reset();
                this.submitted = false;
                this.router.navigate([''])
            },
            (error) => {
                this.loading = false;
                this.notifyService.showError('Error al enviar el email', 'Error');
                console.log("error", error);
            })
    }
}