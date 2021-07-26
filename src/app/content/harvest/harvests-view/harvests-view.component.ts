import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
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

  constructor(
    private harvestService: HarvestService,
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
    this.harvestService.getFullInfoHarvest().subscribe(data => {
      data.forEach(element => {
        console.log("Fecha inicio:", element.dateStart.toDate());
      });
    });
  }

  getUserLogged(): void {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  reload(): void {
    this.blockUIHarvest.start('Cargando...');

    setTimeout(() => {
      this.blockUIHarvest.stop();
    }, 2500);
  }

}
