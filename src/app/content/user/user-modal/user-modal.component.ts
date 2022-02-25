import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user/user.service';
import * as firebase from 'firebase/app';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { UserInterface } from 'src/app/_models/user';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

export interface PositionInterface {
  id: string;
  name: string;
}

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @Input() public rol: string;
  @Input() public uid: string;
  @Input() public opc: boolean;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @BlockUI('userInfo') blockUIuser: NgBlockUI;

  public registerForm: FormGroup;
  public loading = false;
  public submitted = false;
  private user: UserInterface = {};
  private users = [];
  public positions: PositionInterface[] = [];

  public title: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.title = 'Agregar nuevo usuario';

    if (this.rol === 'admin' || this.rol === 'company') {
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        run: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]+-[0-9kK]{1}$/), this.checkVerificatorDigit]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rol: [null, Validators.required]
      });

      this.positions.push(
        {
          id: 'admin',
          name: 'Administrador'
        },
        {
          id: 'worker',
          name: 'Trabajador'
        },
        {
          id: 'planner',
          name: 'Planillero'
        },
        {
          id: 'harvester',
          name: 'Cosechador'
        }
      );
    } else {
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        run: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]+-[0-9kK]{1}$/), this.checkVerificatorDigit]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }

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

  checkRun() {
    let run = this.f['run'];
    //Despejar Puntos
    var runClean = run.value.replace('.', '');
    // Despejar Guión
    runClean = runClean.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    let body = runClean.slice(0, -1);
    let dv = runClean.slice(-1).toUpperCase();

    // Formatear RUN
    run.setValue(body + '-' + dv);
  }

  checkVerificatorDigit(control: AbstractControl) {
    let run = control;
    if (run.value == "") return null;
    //Despejar Puntos
    var runClean = run.value.replace('.', '');
    // Despejar Guión
    runClean = runClean.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    let body = runClean.slice(0, -1);
    let dv = runClean.slice(-1).toUpperCase();

    // Calcular Dígito Verificador
    let suma = 0;
    let multiplo = 2;

    // Para cada dígito del Cuerpo
    for (let i = 1; i <= body.length; i++) {

      // Obtener su Producto con el Múltiplo Correspondiente
      let index = multiplo * runClean.charAt(body.length - i);

      // Sumar al Contador General
      suma = suma + index;

      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) {
        multiplo = multiplo + 1;
      } else {
        multiplo = 2;
      }

    }

    // Calcular Dígito Verificador en base al Módulo 11
    let dvEsperado = 11 - (suma % 11);

    // Casos Especiales (0 y K)
    dv = (dv == 'K') ? 10 : dv;
    dv = (dv == 0) ? 11 : dv;

    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado != dv) {
      return { verificator: true };
    }
    else null;
  }

  onUserSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.blockUIuser.start("Guardando...");

    this.authService.doRegister(this.registerForm.value)
      .then(res => {
        this.loading = false;

        if (this.rol === 'superadmin') {
          this.user = {
            firstName: this.fValue.firstName,
            lastName: this.fValue.lastName,
            run: this.fValue.run,
            email: this.fValue.email,
            password: this.fValue.password,
            uid: res.user.uid,
            isenabled: true,
            rol: 'company'
          };
        } else if (this.rol === 'admin' || this.rol === 'company') {
          this.user = {
            firstName: this.fValue.firstName,
            lastName: this.fValue.lastName,
            run: this.fValue.run,
            email: this.fValue.email,
            password: this.fValue.password,
            uid: res.user.uid,
            isenabled: true,
            rol: this.fValue.rol,
            cuid: this.uid
          };
        }
        const currentUser = firebase.auth().currentUser;
        currentUser.updateProfile({
          displayName: this.user.firstName
        }).then(user => { }, err => {
          console.log("Error en user-modal", err);
        });

        this.blockUIuser.stop();
        this.passEntry.emit(true);
        this.activeModal.close(true);

        if (this.users.length === 0) {
          this.userService.createUser(this.user).then(user => {
            
          });
        } else if (this.users.length !== 0) {
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].uid !== res.user.uid) {
              this.userService.createUser(this.user).then(user => {
              });
              break;
            } else {
              console.log('error');
            }
          }
        } else {
          console.log('error');
        }
        //this.router.navigate(['/login']);
      }, err => {
        console.log(err);
        this.blockUIuser.stop();
        this.notifyService.showError("Error", err.message);
        //this.alertService.error(err.message);
      });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName).hasError(errorName);
  };

}
