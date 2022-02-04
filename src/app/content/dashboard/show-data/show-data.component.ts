import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { Harvest } from 'src/app/_models/harvest';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';
import * as chartsData from './data';

@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.css']
})
export class ShowDataComponent implements OnInit {

  @BlockUI('barCharts') blockUIProductsInfo: NgBlockUI;
  @BlockUI('categoriesCard') blockUIcategoriesCard: NgBlockUI;
  @BlockUI('registersCard') blockUIregisterCard: NgBlockUI;
  public breadcrumb: BreadcrumbInterface;

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

  /**
   * Pie
   */
  public pieChartLabels = chartsData.pieChartLabels;
  public pieChartData = chartsData.pieChartData;
  public pieChartType = chartsData.pieChartType;
  public pieChartColors = chartsData.pieChartColors;
  public pieChartOptions = chartsData.pieChartOptions;

  public pieChartLabels2: string[] = []; //nombres
  public pieChartData2: number[] = []; // pesos de cosecha

  /**/

  private harvests: Harvest[];
  public quantitieCategory: number;
  public quantitieRegisters: number;

  constructor(
    private harvestService: HarvestService,
  ) { }

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
      ],
      'options': true
    };

    this.getFullInfoHarvest();
  }

  getFullInfoHarvest(): void {
    this.blockUIcategoriesCard.start("Cargando...");
    this.harvestService.getFullInfoHarvest().subscribe(data => {
      this.harvests = data;
      this.quantitieCategory = this.harvests.length;
      this.blockUIcategoriesCard.stop();
    });
  }

  reloadBarCharts(): void {

  }

  setValuesInDashboard(harvest: Harvest): void {
    this.getDataCardRegister(harvest.id);
  }

  getDataCardRegister(id: string): void {
    this.blockUIregisterCard.start("Cargando...");
    this.harvestService.getFullInfoRegisterHarvest(id).subscribe(data => {
      this.pieChartLabels2 = [];
      this.pieChartData2 = [];
      data.forEach(element => {
        this.pieChartLabels2.push(element.name);
        var num = parseFloat((Math.round(element.acumulate * 100) / 100).toFixed(2));
        this.pieChartData2.push(num);
      });
      this.quantitieRegisters = data.length;
      this.blockUIregisterCard.stop();
    });
  }
}
