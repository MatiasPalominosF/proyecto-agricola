import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as chartsData from './data';

@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.css']
})
export class ShowDataComponent implements OnInit {

  @BlockUI('barCharts') blockUIProductsInfo: NgBlockUI;
  public breadcrumb: any;

  //Options for bar charts.
  options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };

  //Data for bar charts.
  public barChartOptions = chartsData.barChartOptions;
  public barChartLabels = chartsData.barChartLabels;
  public barChartType = chartsData.barChartType;
  public barChartLegend = chartsData.barChartLegend;
  public barChartData = chartsData.barChartData;
  public barChartColors = chartsData.barChartColors;

  constructor() { }

  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Visualización de datos',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/show-data'
        },
        {
          'name': 'Dashboard',
          'isLink': false,
          'link': '#'
        },
      ]
    };
  }

  reloadBarCharts(): void {

  }

}
