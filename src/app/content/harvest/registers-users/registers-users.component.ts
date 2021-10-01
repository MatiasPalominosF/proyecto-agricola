import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'src/app/_services/confirmation/confirmation.service';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { RegisterUser } from '../../../_models/register-user';
import { HarvestEditComponent } from '../harvest-edit/harvest-edit.component';

@Component({
  selector: 'app-registers-users',
  templateUrl: './registers-users.component.html',
  styleUrls: ['./registers-users.component.css']
})
export class RegistersUsersComponent implements OnInit {
  @Input() public id: string;
  @Input() public category: string;
  @Input() public acumulate: number;
  @Input() public name: string;
  @Input() public nameUser: string;
  @BlockUI('userRegister') blockUIHarvest: NgBlockUI;

  private closeResult = '';
  public categoryName: string;
  public rol: string;
  private registersUsers: RegisterUser[];
  public title: string;
  private currentUser: any;
  items = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private harvestService: HarvestService,
    private confirmationDialogService: ConfirmationService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.title = "Registro de los usuarios - " + this.nameUser;
    this.getFullInfoRegisterUser();
    this.getDataUserLogged();
  }

  getDataUserLogged(): void {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
  }

  getFullInfoRegisterUser() {
    this.blockUIHarvest.start("Cargando...");
    this.harvestService.getFullInfoRegisterUser(this.category, this.id).subscribe(data => {
      //console.log(data);
      this.registersUsers = data;
      this.categoryName = this.name;
      this.rol = this.currentUser.rol;
      this.blockUIHarvest.stop();
    });
  }

  editRegister(id: string, weight: number) {
    weight = +weight;
    const modalRef = this.modalService.open(HarvestEditComponent, { windowClass: 'animated fadeInDown', size: 'sm', backdrop: 'static' });
    modalRef.componentInstance.weight = weight;
    modalRef.componentInstance.idCategory = this.category;
    modalRef.componentInstance.idUser = this.id;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.acumulate = this.acumulate;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Editar", "¡El registro se editó correctamente!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateAcumulate(weight: number): void {
    weight = +weight;
    this.acumulate -= weight;
    this.harvestService.updateFieldInRegisterUsers(this.category, this.id, this.acumulate);
    // idCategory, idUser y se actualiza el acumulado

  }

  delete(id: string, weight: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Estás seguro de eliminar el registro?').then(confirmed => {
      if (!confirmed) {
      } else {
        this.harvestService.deleteProduct(this.category, this.id, id).finally(() => {
          //LLamar función que actualizas el promedio.
          this.updateAcumulate(weight);
          this.notifyService.showSuccess("Eliminar", "¡El registro se eliminó correctamente!");
        });
      }
    }).catch(() => {
      console.log("Not ok");
    });


  }

}
