import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { Harvest } from 'src/app/_models/harvest';
import { UserInterface } from 'src/app/_models/user';
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
  public pieChartLabels: string[] = []; //nombres
  public pieChartData: number[] = []; // pesos de cosecha
  public pieChartType = chartsData.pieChartType;
  public pieChartColors = chartsData.pieChartColors;
  public pieChartOptions = chartsData.pieChartOptions;


  /**/

  private harvests: Harvest[];
  public quantitieCategory: number;
  public quantitieRegisters: number;
  private currentUser: UserInterface;

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

    this.getUserLogged();
    this.getFullInfoHarvest();
  }

  getUserLogged(): void {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
  }

  getFullInfoHarvest(): void {
    this.blockUIcategoriesCard.start("Cargando...");

    if (this.currentUser.rol === 'company') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.uid).subscribe(data => {
        this.harvests = data;
        this.quantitieCategory = this.harvests.length;
        this.blockUIcategoriesCard.stop();
      });
    } else if (this.currentUser.rol === 'admin' || this.currentUser.rol === 'planner') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.cuid).subscribe(data => {
        this.harvests = data;
        this.quantitieCategory = this.harvests.length;
        this.blockUIcategoriesCard.stop();
      });
    }
  }

  reloadBarCharts(): void {

  }

  setValuesInDashboard(harvest: Harvest): void {
    this.getDataCardRegister(harvest.id);
  }

  getDataCardRegister(id: string): void {
    this.blockUIregisterCard.start("Cargando...");
    if (this.currentUser.rol === 'company') {
      this.harvestService.getFullInfoRegisterHarvestWithUid(this.currentUser.uid, id).subscribe(data => {

        this.pieChartLabels = [];
        this.pieChartData = [];

        if (data.length === 0) {
          this.pieChartLabels.push("Sin datos");
          this.pieChartData.push(0)
          this.blockUIregisterCard.stop();
        }
        data.forEach(element => {
          this.pieChartLabels.push(element.name);
          var num = parseFloat((Math.round(element.acumulate * 100) / 100).toFixed(2));
          this.pieChartData.push(num);
        });
        this.quantitieRegisters = data.length;
        this.blockUIregisterCard.stop();
      });
    } else if (this.currentUser.rol === 'admin' || this.currentUser.rol === 'planner') {
      this.harvestService.getFullInfoRegisterHarvestWithUid(this.currentUser.cuid, id).subscribe(data => {

        this.pieChartLabels = [];
        this.pieChartData = [];

        if (data.length === 0) {
          this.pieChartLabels.push("Sin datos");
          this.pieChartData.push(0)
          this.blockUIregisterCard.stop();
        }
        data.forEach(element => {
          this.pieChartLabels.push(element.name);
          var num = parseFloat((Math.round(element.acumulate * 100) / 100).toFixed(2));
          this.pieChartData.push(num);
        });
        this.quantitieRegisters = data.length;
        this.blockUIregisterCard.stop();
      });
    }

  }
}
