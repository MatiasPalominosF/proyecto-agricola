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
  @Input() public name: string;
  @Input() public nameUser: string;
  @BlockUI('userRegister') blockUIHarvest: NgBlockUI;

  public categoryName: string;
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
      console.log(data);
      this.registersUsers = data;
      this.categoryName = this.name;
      this.title += " - " + this.nameUser
      this.blockUIHarvest.stop();
    });
  }

}
