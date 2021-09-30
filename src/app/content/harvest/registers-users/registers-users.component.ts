import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';
import { RegisterUser } from '../../../_models/register-user';

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

  public categoryName: string;
  public rol: boolean;
  private registersUsers: RegisterUser[];
  public title: string;
  items = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  constructor(
    public activeModal: NgbActiveModal,
    private harvestService: HarvestService,
  ) { }

  ngOnInit(): void {
    this.title = "Registro de los usuarios";
    this.getFullInfoRegisterUser();
  }

  getFullInfoRegisterUser() {
    this.blockUIHarvest.start("Cargando...");
    this.harvestService.getFullInfoRegisterUser(this.category, this.id).subscribe(data => {
      //console.log(data);
      this.registersUsers = data;
      this.categoryName = this.name;
      this.title += " - " + this.nameUser
      this.rol = true;
      this.blockUIHarvest.stop();
    });
  }

  editRegister(id: string) {
    console.log("Se edita registro ID: " + id);
  }

  updateAcumulate(weight: number): void {
    weight = +weight;
    this.acumulate -= weight;
    this.harvestService.updateFieldInRegisterUsers(this.category, this.id, this.acumulate);
    // idCategory, idUser y se actualiza el acumulado

  }

  delete(id: string, weight: number): void {
    this.harvestService.deleteProduct(this.category, this.id, id).finally(() => {
      //LLamar función que actualizas el promedio.
      this.updateAcumulate(weight);
    });
  }

}
