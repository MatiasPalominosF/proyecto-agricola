import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { Harvest } from 'src/app/_models/harvest';
import { UserInterface } from 'src/app/_models/user';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  public dataForSelect: Array<Harvest> = [];
  public dataForSelect2: Array<Harvest> = [];
  public singlebasicSelected: Harvest = {};
  public currentUser: UserInterface;

  @BlockUI('selectBlockUi') blockUISelect: NgBlockUI;
  constructor(
    private harvestService: HarvestService,
  ) { }

  @Input() breadcrumb: BreadcrumbInterface;
  @Output() idCategory = new EventEmitter<Harvest>();

  ngOnInit() {
    this.processBreadCrumbLinks();

    this.getUserLogged();
    this.getFullInfoHarvest();
    //this.getFullInHarvest();
  }

  getUserLogged() {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
  }

  private processBreadCrumbLinks() {
  }

  /**
   * Utilizar si se necesita que exista sincronización de datos en tiempo real.
   */
  getFullInfoHarvest(): void {
    if (this.currentUser.rol === 'company') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.uid).subscribe(data => {
        this.dataForSelect = data;
        this.singlebasicSelected = this.dataForSelect[0];
        this.idCategory.emit(this.singlebasicSelected);
      });

    } else if (this.currentUser.rol === 'admin' || this.currentUser.rol === 'planner') {
      this.harvestService.getFullInfoHarvestWithUid(this.currentUser.cuid).subscribe(data => {
        this.dataForSelect = data;
        this.singlebasicSelected = this.dataForSelect[0];
        this.idCategory.emit(this.singlebasicSelected);
      });
    }
  }


  /**
   * Método parecido a getFullInfoHarvest(), pero no se obtienen los datos en tiempo real.
   */
  getFullInHarvest() {
    this.harvestService.getFullInHarvest().then((data => {
      data.forEach(element => {
        this.dataForSelect2.push(element.data());
      });
    })).finally(() => {
      this.dataForSelect = this.dataForSelect2;
      this.singlebasicSelected = this.dataForSelect[0];
      this.idCategory.emit(this.singlebasicSelected);
    });
  }
  change($event: Harvest): void {
    if ($event) {
      this.singlebasicSelected = $event;
      this.idCategory.emit(this.singlebasicSelected);
    }
  }
}
