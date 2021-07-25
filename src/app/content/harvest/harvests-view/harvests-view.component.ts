import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-harvests-view',
  templateUrl: './harvests-view.component.html',
  styleUrls: ['./harvests-view.component.css']
})
export class HarvestsViewComponent implements OnInit {

  public breadcrumb: any;

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
      ]
    };
  }

}
