import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { HarvestService } from 'src/app/_services/harvest/harvest.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { CreateCategoryComponent } from '../create-category/create-category.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('categoriesCard') blockUICategories: NgBlockUI;


  //Settings MatTable

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<Harvest> = new MatTableDataSource<Harvest>();
  public isEmpty: boolean = false;

  //End settings MatTable

  public breadcrumb: BreadcrumbInterface;
  private currentUser: UserInterface;
  private rol: string;
  private closeResult = '';


  constructor(
    private harvestService: HarvestService,
    private modalService: NgbModal,
    private notifyService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Gestionar categorías',
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

    this.displayedColumns = ['position', 'name', 'dateStart', 'dateEnd'];

    this.getUserLogged();
    this.setRol();
    this.getFullInfoHarvest();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();
  }


  //Functions to MatTable

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
      let searchString = JSON.parse(filter);

      // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
      return data.name.toString().trim().toLowerCase().indexOf(searchString.name.toString().trim().toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  //End function MatTable

  getFullInfoHarvest(): void {
    this.blockUICategories.start("Cargando...");
    if (this.rol === 'company') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.uid).subscribe(harvests => {
        if (harvests.length === 0) {
          this.isEmpty = true;
          this.blockUICategories.stop();
          this.isEmpty = false;
          return;
        }
        this.dataSource.data = harvests;
        this.blockUICategories.stop();
      });
    } else if (this.rol === 'admin' || this.rol === 'planner') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.cuid).subscribe(harvests => {
        if (harvests.length === 0) {
          this.isEmpty = true;
          this.blockUICategories.stop();
          this.isEmpty = false;
          return;
        }
        this.dataSource.data = harvests;
        this.blockUICategories.stop();
      });
    }

  }

  createCategory(): void {
    const modalRef = this.modalService.open(CreateCategoryComponent, { windowClass: 'animated fadeInDown', backdrop: 'static' });
    if (this.rol === 'company') {
      modalRef.componentInstance.uid = this.currentUser.uid;
    } else if (this.rol === 'admin') {
      modalRef.componentInstance.uid = this.currentUser.cuid;
    }
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Agregar", "¡La categoría se añadió correctamente!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  setRol() {
    let rol: string = this.currentUser.rol;

    switch (rol) {
      case 'superadmin': {
        this.rol = 'superadmin';
        break;
      }
      case 'admin': {
        this.rol = 'admin';
        break;
      }
      case 'company': {
        this.rol = 'company';
        break;
      }
      case 'worker': {
        this.rol = 'worker';
        break;
      }
      case 'planner': {
        this.rol = 'planner';
        break;
      }
    }

  }

  getUserLogged(): void {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
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

}
