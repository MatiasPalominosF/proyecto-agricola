import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
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
import { DataCategory } from '../harvests-view/harvests-view.component';
import { RegisterUser } from 'src/app/_models/register-user';

export interface DataToExcel {
  idCategoria?: string;
  nombreCategoria?: string;
  idUsuario?: string;
  nombreUsuario?: string;
  peso?: string;
  fechaCosecha?: any;
}

@Component({
  selector: 'app-registers-harvest',
  templateUrl: './registers-harvest.component.html',
  styleUrls: ['./registers-harvest.component.css']
})
export class RegistersHarvestComponent implements OnInit {
  @Input() public id: string;
  @Input() public name: string;
  @Input() public categories: Array<DataCategory>;
  @Input() public harvests: Harvest[];
  @BlockUI('registerHarvest') blockUIHarvest: NgBlockUI;
  @BlockUI('buttonExcel') buttonExcelBlock: NgBlockUI;



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
  private dataToExport2: Array<DataToExcel>;
  private dataToExcel: Array<DataToExcel> = [];
  public from = new Date('December 25, 1995 13:30:00');;
  public to = new Date();
  private closeResult = '';
  private registersUsers: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private harvestService: HarvestService,
    private modalService: NgbModal,
    private tableexcelService: TableExcelService
  ) { }

  ngOnInit(): void {
    this.title = "Registros de las cosechas - " + this.name;;
    this.getFullInfoRegisterHarvest();

  }

  exportToExcel() {
    this.dataToExport2 = [];

    this.dataToExcel.forEach(data => {
      let objectFinded = this.dataToExport2.find(function (el) { return el.idUsuario == data.idUsuario && el.idCategoria == data.idCategoria });
      if (objectFinded != undefined) {
        let objectInArray = this.dataToExport2.find(function (el) { return el.idUsuario == data.idUsuario && el.idCategoria == data.idCategoria });
        let indexObjectInArray = this.dataToExport2.indexOf(objectInArray);
        let object: DataToExcel = {};
        object.idUsuario = data.idUsuario;
        object.nombreUsuario = data.nombreUsuario;
        object.idCategoria = data.idCategoria;
        object.fechaCosecha = data.fechaCosecha;
        object.nombreCategoria = data.nombreCategoria;
        let acumulate = parseFloat(data.peso) + parseFloat(objectInArray.peso);
        acumulate = Math.round((acumulate + Number.EPSILON) * 100) / 100;
        object.peso = acumulate.toString();
        this.dataToExport2[indexObjectInArray] = object;
        objectFinded = undefined;
      } else {
        this.dataToExport2.push(data);
        objectFinded = undefined;
      }
    });

    this.tableexcelService.exportAsExcelFile(this.dataToExport2, 'Proyecto agrícola - Registro de cosechas');
  }




  async getDataToExcel() {
    this.dataToExcel = [];

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }

    const start = async () => {
      await asyncForEach(this.categories, async (category) => {
        await waitFor(50);
        await asyncForEach(this.dataToExport, async (register) => {
          await waitFor(50);
          const datepipe: DatePipe = new DatePipe('en-US')
          let a = datepipe.transform(register.lastDate.toDate(), 'yyyy-MM-dd');
          let b = datepipe.transform(register.lastDate.toDate(), 'yyyy-MM-dd');
          let dateInit = new Date(a + "T00:00:00");
          let dateEnd = new Date(b + "T23:59:59.999999999");
          this.harvestService.getFullInfoRegisterHarvestCondition(category.idCategory, register.id, dateInit, dateEnd).subscribe(data => {
            data.forEach(element => {
              let object: DataToExcel = {};
              object.idCategoria = category.idCategory;
              object.nombreCategoria = category.nameCategory;
              object.idUsuario = register.id;
              object.nombreUsuario = register.name;
              object.peso = element.weight;
              object.fechaCosecha = element.date.toDate();

              if (!this.dataToExcel.some(el => el === object)) {
                this.dataToExcel.push(object);

              }
              object = {};
            });
          });
        });
      });
      this.buttonExcelBlock.stop();
    }
    start();
  }

  showDetails(id: string, name: string, acumulate: number): void {
    const modalRef = this.modalService.open(RegistersUsersComponent, { windowClass: 'animated fadeInDown', size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.id = id; //ID del usuario.
    modalRef.componentInstance.category = this.id; //ID de la categoría.
    modalRef.componentInstance.acumulate = acumulate;
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
    this.buttonExcelBlock.start("Cargando...");
    this.harvestService.getFullInfoRegisterHarvest(this.id).subscribe(data => {
      /*data.forEach(element => {
        console.log(element.lastDate.toDate().toLocaleDateString('es-CL', { weekday: 'long' }));
      });*/ ///SE OBTIENE EL DÍA DE LA SEMANA CON ESTO....
      this.registerHarvests = data;
      this.collectionSize = this.registerHarvests.length;
      this.searchData(this.pipe);
      this.getDataToExport();
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
      this.getDataToExcel();
    });
  }


  reload(): void {
    this.getFullInfoRegisterHarvest();
  }

}
