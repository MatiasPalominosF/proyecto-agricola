import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

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

  constructor() { }

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
    console.log("this.currentUser", this.currentUser);
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
