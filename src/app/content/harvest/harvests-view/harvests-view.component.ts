import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Harvest } from 'src/app/_models/harvest';
import { HarvestService } from '../../../_services/harvest/harvest.service';

@Component({
  selector: 'app-harvests-view',
  templateUrl: './harvests-view.component.html',
  styleUrls: ['./harvests-view.component.css']
})
export class HarvestsViewComponent implements OnInit {

  @BlockUI('harvests') blockUIHarvest: NgBlockUI;

  public breadcrumb: any;
  public options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };
  public headElements = ['#', 'Categoría', 'Fecha inicio', 'Fecha término', 'Acciones'];
  private currentUser: any;
  private harvests: Harvest[];
  public collectionSize: any;
  public harvestSearch: Observable<Harvest[]>;
  public filter = new FormControl('');
  public pipe: any;
  public from = new Date('December 25, 1995 13:30:00');;
  public to = new Date();
  public page = 1;
  public pageSize = 4;
  private dataToExport = [];

  constructor(
    private harvestService: HarvestService
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
          'name': 'Cosecha',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': true
    };
    this.getUserLogged();
    this.getFullInfoHarvest();
  }

  getFullInfoHarvest(): void {
    this.blockUIHarvest.start("Cargando...");
    this.harvestService.getFullInfoHarvest().subscribe(data => {
      this.harvests = data;
      this.collectionSize = this.harvests.length;
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
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  showDetails(id: string): void {
    console.log("ID: " + id);
  }

  reload(): void {
    console.log("que hay: ", this.dataToExport);

    this.blockUIHarvest.start('Cargando...');

    setTimeout(() => {
      this.blockUIHarvest.stop();
    }, 2500);


  }

}
