import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
export class RegistersHarvestComponent implements OnInit, AfterViewInit {
  @Input() public id: string;
  @Input() public name: string;
  @Input() public categories: Array<DataCategory>;
  @Input() public harvests: Harvest[];
  @BlockUI('registerHarvest') blockUIHarvest: NgBlockUI;
  @BlockUI('buttonExcel') buttonExcelBlock: NgBlockUI;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Settings MatTable

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<RegisterHarvest> = new MatTableDataSource<RegisterHarvest>();
  public isEmpty: boolean = false;

  //End settings MatTable

  public filterForm: FormGroup;
  public title: string;

  private registerHarvests: RegisterHarvest[];
  public pipe: DatePipe;

  private dataToExport: Array<RegisterHarvest> = [];
  private dataToExport2: Array<DataToExcel>;
  private dataToExcel: Array<DataToExcel> = [];

  private closeResult = '';
  private registersUsers: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private harvestService: HarvestService,
    private modalService: NgbModal,
    private tableexcelService: TableExcelService
  ) { }

  ngOnInit(): void {
    this.title = "Registros de las cosechas - " + this.name;

    this.displayedColumns = ['position', 'id', 'name', 'acumulate', 'lastDate', 'actions'];
    this.filterForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl(),
    });

    this.getFullInfoRegisterHarvest();

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();
  }

  get fromDate() {
    return this.filterForm.get('fromDate').value;
  }
  get toDate() {
    return this.filterForm.get('toDate').value;
  }

  //Functions to MatTable
  applyFilterDate() {
    let filteredValues = {
      dateStart: null,
      dateEnd: null,
    }
    filteredValues['dateStart'] = this.fromDate;
    filteredValues['dateEnd'] = this.toDate;
    this.dataSource.filter = JSON.stringify(filteredValues);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredValues = {
      name: '',
      id: '',
      acumulate: ''
    };

    filteredValues['name'] = filterValue;
    filteredValues['id'] = filterValue;
    filteredValues['acumulate'] = filterValue;
    this.dataSource.filter = JSON.stringify(filteredValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortingCustomAccesor = (item: RegisterHarvest, property) => {
    switch (property) {
      case 'id': return item.id;
      case 'name': return item.name;
      case 'acumulate': return item.acumulate;
      case 'lastDate': return item.lastDate;
      default: return item[property];
    }
  };

  /**
  * 
  * This function is used when I need filter by search or when I need filter
  * by date. Parameter data is information from BD and filter is a object with properties
  * charged in two functions: applyFilter and applyFilterDate.
  * 
  * @returns Custom accessor function
  */
  filterCustomAccessor(): (data: RegisterHarvest, filter: string) => boolean {
    const myFilterPredicate = (data: RegisterHarvest, filter: string): boolean => {
      let valueFilter = JSON.parse(filter);
      if (valueFilter.name != null) {
        // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
        return data.name.toString().trim().toLowerCase().indexOf(valueFilter.name.toString().trim().toLowerCase()) !== -1 ||
          data.id.toString().trim().toLowerCase().indexOf(valueFilter.id.toString().trim().toLowerCase()) !== -1 ||
          data.acumulate.toString().trim().indexOf(valueFilter.acumulate) !== -1;
      } else if (valueFilter.dateStart != null) {
        if (valueFilter.dateEnd == null) {
          return data.lastDate.toDate() >= new Date(valueFilter.dateStart) && data.lastDate.toDate() <= new Date();
        } else {
          return data.lastDate.toDate() >= new Date(valueFilter.dateStart) && data.lastDate.toDate() <= new Date(valueFilter.dateEnd);
        }
      } else {
        return true;
      }
    }
    return myFilterPredicate;
  }

  //End function MatTable


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
    this.harvestService.getFullInfoRegisterHarvest(this.id).subscribe(registerharvests => {
      /*data.forEach(element => {
        console.log(element.lastDate.toDate().toLocaleDateString('es-CL', { weekday: 'long' }));
      });*/ ///SE OBTIENE EL DÍA DE LA SEMANA CON ESTO....

      if (registerharvests.length === 0) {
        this.isEmpty = true;
        this.blockUIHarvest.stop();
        this.isEmpty = false;
        return;
      }
      this.dataSource.data = registerharvests;
      this.registerHarvests = registerharvests;
      this.getDataToExport(registerharvests);
      this.blockUIHarvest.stop();
    });
  }

  getDataToExport(registers: RegisterHarvest[]): void {
    this.dataToExport = registers;
    this.getDataToExcel();
  }
}
