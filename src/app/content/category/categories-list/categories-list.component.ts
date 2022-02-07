import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
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
export class CategoriesListComponent implements OnInit {

  @BlockUI('categoriesCard') blockUICategories: NgBlockUI;

  public breadcrumb: BreadcrumbInterface;
  private currentUser: UserInterface;
  public options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };
  public headElements = ['#', 'Categoría', 'Fecha inicio', 'Fecha término', 'Acciones'];
  private harvests: Harvest[];
  public collectionSize: any;
  private rol: string;
  public pipe: any;
  public page = 1;
  public pageSize = 4;
  public harvestSearch: Observable<Harvest[]>;
  public filter = new FormControl('');
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
    this.getUserLogged();
    this.setRol();
    this.getFullInfoHarvest();
  }

  getFullInfoHarvest(): void {
    this.blockUICategories.start("Cargando...");
    if (this.rol === 'company') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.uid).subscribe(data => {
        this.harvests = data;
        this.collectionSize = this.harvests.length;
        this.searchData(this.pipe);
        this.blockUICategories.stop();
      });
    } else if (this.rol === 'admin' || this.rol === 'planner') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.cuid).subscribe(data => {
        this.harvests = data;
        this.collectionSize = this.harvests.length;
        this.searchData(this.pipe);
        this.blockUICategories.stop();
      });
    }

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
    return this.harvests.filter(response => {
      const term = text.toLowerCase();
      return response.name.toLowerCase().includes(term)
    });
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

  delete(id: string): void {
    console.log("ID: " + id);
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

  reload(event: any): void {
    this.blockUICategories.start('Cargando...');

    setTimeout(() => {
      this.blockUICategories.stop();
    }, 2500);
  }

}
