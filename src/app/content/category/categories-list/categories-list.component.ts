import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  public breadcrumb: any;

  constructor() { }

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
  }

}
