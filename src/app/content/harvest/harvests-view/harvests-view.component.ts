import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
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
export class HarvestsViewComponent implements OnInit {

  @BlockUI('harvests') blockUIHarvest: NgBlockUI;

  public breadcrumb: BreadcrumbInterface;
  public options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };
  public headElements = ['#', 'Categoría', 'Fecha inicio', 'Fecha término', 'Acciones'];
  private currentUser: UserInterface;
  private harvests: Harvest[];
  public collectionSize: any;
  public harvestSearch: Observable<Harvest[]>;
  public filter = new FormControl('');
  public pipe: any;
  public from = new Date(1920, 0, 1, 0, 0, 0);;
  public to = new Date();
  public page = 1;
  public pageSize = 4;
  private dataToExport = [];
  private closeResult = '';
  public prueba = false;
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
    this.getUserLogged();
    this.getFullInfoHarvest();
  }

  getFullInfoHarvest(): void {
    this.categories = [];
    this.blockUIHarvest.start("Cargando...");

    if (this.currentUser.rol === 'company') {
      console.log("company");
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.uid).subscribe(data => {
        data.forEach(element => {
          let object = {
            idCategory: "",
            nameCategory: ""
          }

          object.idCategory = element.id;
          object.nameCategory = element.name;
          this.categories.push(object);
        });
        this.harvests = data;
        this.collectionSize = this.harvests.length;
        this.searchData(this.pipe);
        this.getDataToExport();
        this.blockUIHarvest.stop();
      });
    } else if (this.currentUser.rol === 'admin') {
      console.log("admin");
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.cuid).subscribe(data => {
        data.forEach(element => {
          let object = {
            idCategory: "",
            nameCategory: ""
          }

          object.idCategory = element.id;
          object.nameCategory = element.name;
          this.categories.push(object);
        });
        this.harvests = data;
        this.collectionSize = this.harvests.length;
        this.searchData(this.pipe);
        this.getDataToExport();
        this.blockUIHarvest.stop();
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

  getDataToExport(): void {
    this.harvestSearch.subscribe(data => {
      this.dataToExport = data;
    });
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

  reload(event: any): void {
    console.log("que hay: ", this.dataToExport);

    this.blockUIHarvest.start('Cargando...');

    setTimeout(() => {
      this.blockUIHarvest.stop();
    }, 2500);
  }

}
