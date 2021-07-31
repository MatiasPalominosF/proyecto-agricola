import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RegisterHarvest } from 'src/app/_models/register-harvest';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';
import { RegistersUsersComponent } from '../registers-users/registers-users.component';
import { TableExcelService } from '../../../_services/table-excel/table-excel.service';
import { Harvest } from 'src/app/_models/harvest';

export interface Test {
  idCategory?: string;
  idUser?: string;
  nameUser?: string;
  acumulate?: number;
  lastDate?: any;
}

export interface FullInfo {
  idCategory?: string;
  nameCategory?: string;
  idUser?: string;
  nameUser?: string;
  acumulate?: number;
  lastDate?: any;
}

@Component({
  selector: 'app-registers-harvest',
  templateUrl: './registers-harvest.component.html',
  styleUrls: ['./registers-harvest.component.css']
})
export class RegistersHarvestComponent implements OnInit {
  @Input() public id: string;
  @Input() public name: string;
  @Input() public categories: Array<string>;
  @Input() public harvests: Harvest[];
  @BlockUI('registerHarvest') blockUIHarvest: NgBlockUI;

  public title: string;
  public options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };
  public headElements = ['Run', 'Nombre', 'Peso acumulado (Kg)', 'Fecha término', 'Acciones'];
  private registerHarvests: RegisterHarvest[];
  public collectionSize: any;
  public page = 1;
  public pageSize = 4;
  public pipe: any;
  public harvestSearch: Observable<RegisterHarvest[]>;
  public filter = new FormControl('');
  private dataToExport: Array<RegisterHarvest> = [];
  private dataToExport2: Array<FullInfo>;
  private a: Array<any> = [];
  private b: Array<Test>;
  public from = new Date('December 25, 1995 13:30:00');;
  public to = new Date();
  private closeResult = '';

  constructor(
    public activeModal: NgbActiveModal,
    private harvestService: HarvestService,
    private modalService: NgbModal,
    private tableexcelService: TableExcelService
  ) { }

  ngOnInit(): void {
    this.title = "Registros de las cosechas";
    this.getFullInfoRegisterHarvest();

  }

  exportToExcel() {
    //this.prueba();

    this.dataToExport2 = [];
    console.log("this.b ----> ", this.b);

    this.harvests.forEach(harvest => {
      this.b.forEach(data => {
        if (harvest.id == data.idCategory) {
          let object = {
            idCategory: "",
            nameCategory: "",
            idUser: "",
            nameUser: "",
            acumulate: 0,
            lastDate: null,
          }
          object.idCategory = harvest.id;
          object.nameCategory = harvest.name;
          object.idUser = data.idUser;
          object.nameUser = data.nameUser;
          object.acumulate = data.acumulate;
          object.lastDate = data.lastDate.toDate();
          this.dataToExport2.push(object);
        }
      });
    });

    console.log("this.dataToExport2 --->", this.dataToExport2);

    /*let data = [];
    this.dataToExport.forEach(element => {
      let object = { Rut: "", Nombre: "", Fecha: null, PesoAcumulado: 0 };
      object.Nombre = element.name;
      object.Rut = element.id;
      object.Fecha = element.lastDate.toDate();
      object.PesoAcumulado = element.acumulate;
      data.push(object);
    });
  */
    this.tableexcelService.exportAsExcelFile(this.dataToExport2, 'Proyecto agrícola - Registro de cosechas');
  }


  prueba() {
    this.b = [];
    this.categories.forEach(idCategory => {
      this.dataToExport.forEach(registers => {
        this.harvestService.getFullInfoRegisterHarvestCondition(idCategory, registers.id).subscribe(data => {
          data.forEach(element => {
            let object = {
              idCategory: "",
              idUser: "",
              nameUser: "",
              acumulate: 0,
              lastDate: null,
            };
            object.idCategory = idCategory;
            object.idUser = registers.id;
            object.nameUser = element.name;
            object.acumulate = element.acumulate;
            object.lastDate = element.lastDate;
            //Si ya no se añadió, que lo agregue.
            if (this.b.indexOf(object) === -1) {
              this.b.push(object);
            }
          });

          console.log("ACÁ HAY: ", this.b);
          //console.log(data);
          //this.a.push(data);
          //this.a = this.clearArray(this.a);

        });
      });
    });
  }

  clearArray2(any, object) {
  }

  clearArray(any) {
    any = any.filter((i) => i.length !== 0);
    return any;
  }

  showDetails(id: string, name: string): void {
    const modalRef = this.modalService.open(RegistersUsersComponent, { windowClass: 'animated fadeInDown', size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.id = id; //ID del usuario.
    modalRef.componentInstance.category = this.id; //ID de la categoría.
    modalRef.componentInstance.name = this.name;
    modalRef.componentInstance.nameUser = name;
    modalRef.result.then((result) => {
      if (!result) {
        //this.notifyService.showSuccess("Editar", "¡El producto se editó correctamente!");
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

  getFullInfoRegisterHarvest(): void {
    this.blockUIHarvest.start("Cargando...");
    this.harvestService.getFullInfoRegisterHarvest(this.id).subscribe(data => {
      /*data.forEach(element => {
        console.log(element.lastDate.toDate().toLocaleDateString('es-CL', { weekday: 'long' }));
      });*/ ///SE OBTIENE EL DÍA DE LA SEMANA CON ESTO....
      this.registerHarvests = data;
      this.collectionSize = this.registerHarvests.length;
      this.searchData(this.pipe);
      this.getDataToExport();
      this.title += " - " + this.name;
      this.blockUIHarvest.stop();
    });
  }

  /**
    *
    * '@param' pipe
    */
  searchData(pipe: DecimalPipe) {
    this.harvestSearch = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
  }

  /**
   * Search table
   * '@param' text
   * '@param' pipe
   */
  search(text: string, pipe: PipeTransform) {
    return this.registerHarvests.filter(response => {
      const term = text.toLowerCase();
      return response.name.toLowerCase().includes(term) ||
        response.id.toLowerCase().includes(term)
    });
  }

  getDataToExport(): void {
    this.harvestSearch.subscribe(data => {
      this.dataToExport = data;
      this.prueba();
    });
  }


  reload(): void {
    this.getFullInfoRegisterHarvest();
  }

}
