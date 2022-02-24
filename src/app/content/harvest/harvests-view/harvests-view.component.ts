import { DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { Harvest } from 'src/app/_models/harvest';
import { UserInterface } from 'src/app/_models/user';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { HarvestService } from '../../../_services/harvest/harvest.service';
import { RegistersHarvestComponent } from '../registers-harvest/registers-harvest.component';

export interface DataCategory {
  idCategory?: string;
  nameCategory?: string;
}

@Component({
  selector: 'app-harvests-view',
  templateUrl: './harvests-view.component.html',
  styleUrls: ['./harvests-view.component.css']
})
export class HarvestsViewComponent implements OnInit, AfterViewInit {

  @BlockUI('harvests') blockUIHarvest: NgBlockUI;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Settings MatTable

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<Harvest> = new MatTableDataSource<Harvest>();
  public isEmpty: boolean = false;

  //End settings MatTable

  public filterForm: FormGroup;

  public breadcrumb: BreadcrumbInterface;

  private currentUser: UserInterface;
  private harvests: Harvest[];
  public pipe: DatePipe;
  private closeResult = '';
  private categories: Array<DataCategory>;

  constructor(
    private harvestService: HarvestService,
    private modalService: NgbModal,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Datos de la cosecha',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/show-data'
        },
        {
          'name': 'Cosechas',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };

    this.displayedColumns = ['position', 'name', 'dateStart', 'dateEnd', 'actions'];
    this.filterForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl(),
    });

    this.getUserLogged();
    this.getFullInfoHarvest();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    //this.filterDate();
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
    };

    filteredValues['name'] = filterValue;
    this.dataSource.filter = JSON.stringify(filteredValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortingCustomAccesor = (item: Harvest, property) => {
    switch (property) {
      case 'name': return item.name;
      case 'dateStart': return item.dateStart;
      case 'dateEnd': return item.dateEnd;
      default: return item[property];
    }
  };

  /**
  * 
  * @returns Custom accessor function
  */
  filterCustomAccessor() {
    const myFilterPredicate = (data: Harvest, filter: string): boolean => {
      let valueFilter = JSON.parse(filter);
      if (valueFilter.name != null) {
        // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
        return data.name.toString().trim().toLowerCase().indexOf(valueFilter.name.toString().trim().toLowerCase()) !== -1;
      } else if (valueFilter.dateStart != null) {
        if (valueFilter.dateEnd == null) {
          return data.dateStart.toDate() >= new Date(valueFilter.dateStart) && data.dateStart.toDate() <= new Date();
        } else {
          return data.dateStart.toDate() >= new Date(valueFilter.dateStart) && data.dateStart.toDate() <= new Date(valueFilter.dateEnd);
        }
      } else {
        return true;
      }
    }
    return myFilterPredicate;
  }

  //End function MatTable

  getFullInfoHarvest(): void {
    this.categories = [];
    this.blockUIHarvest.start("Cargando...");

    if (this.currentUser.rol === 'company') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.uid).subscribe(harvests => {
        harvests.forEach(element => {
          let object = {
            idCategory: "",
            nameCategory: ""
          }

          object.idCategory = element.id;
          object.nameCategory = element.name;
          this.categories.push(object);
        });

        if (harvests.length === 0) {
          this.isEmpty = true;
          this.blockUIHarvest.stop();
          this.isEmpty = false;
          return;
        }
        this.dataSource.data = harvests;
        this.harvests = harvests;
        this.blockUIHarvest.stop();
      });
    } else if (this.currentUser.rol === 'admin' || this.currentUser.rol === 'worker' || this.currentUser.rol === 'planner') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.cuid).subscribe(harvests => {
        harvests.forEach(element => {
          let object = {
            idCategory: "",
            nameCategory: ""
          }

          object.idCategory = element.id;
          object.nameCategory = element.name;
          this.categories.push(object);
        });

        if (harvests.length === 0) {
          this.isEmpty = true;
          this.blockUIHarvest.stop();
          this.isEmpty = false;
          return;
        }
        this.dataSource.data = harvests;
        this.harvests = harvests;
        this.blockUIHarvest.stop();
      });
    }
  }

  getUserLogged(): void {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
  }

  showDetails(id: string, name: string): void {
    const modalRef = this.modalService.open(RegistersHarvestComponent, { windowClass: 'animated fadeInDown my-class', size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.categories = this.categories;
    modalRef.componentInstance.harvests = this.harvests;
    modalRef.result.then((result) => {
      if (!result) {
        this.notifyService.showSuccess("Editar", "¡El producto se editó correctamente!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  public hasError = (controlName: string, errorName: string) => {
    return this.filterForm.get(controlName).hasError(errorName);
  };
}
