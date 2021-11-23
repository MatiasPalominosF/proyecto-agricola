import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Harvest } from 'src/app/_models/harvest';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  @BlockUI('categoriesCard') blockUICategories: NgBlockUI;

  public breadcrumb: any;
  private currentUser: any;
  public options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };
  public headElements = ['#', 'Categoría', 'Fecha inicio', 'Fecha término', 'Acciones'];
  private harvests: Harvest[];
  public collectionSize: any;
  public pipe: any;
  public page = 1;
  public pageSize = 4;
  public harvestSearch: Observable<Harvest[]>;
  public filter = new FormControl('');


  constructor(
    private harvestService: HarvestService,
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
    this.getFullInfoHarvest();
  }

  getFullInfoHarvest(): void {
    this.blockUICategories.start("Cargando...");
    this.harvestService.getFullInfoHarvest().subscribe(data => {
      console.log("Data:", data);
      this.harvests = data;
      this.collectionSize = this.harvests.length;
      this.searchData(this.pipe);
      this.blockUICategories.stop();
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

  getUserLogged(): void {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  reload(event: any): void {
    this.blockUICategories.start('Cargando...');

    setTimeout(() => {
      this.blockUICategories.stop();
    }, 2500);
  }

}
