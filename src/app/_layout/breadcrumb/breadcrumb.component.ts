import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Harvest } from 'src/app/_models/harvest';
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
  @BlockUI('selectBlockUi') blockUISelect: NgBlockUI;
  constructor(
    private harvestService: HarvestService,
  ) { }

  @Input() breadcrumb: object;
  @Output() idCategory = new EventEmitter<Harvest>();

  ngOnInit() {
    this.processBreadCrumbLinks();

    this.getFullInfoHarvest();
    //this.getFullInHarvest();
  }
  private processBreadCrumbLinks() {
  }

  /**
   * Utilizar si se necesita que exista sincronización de datos en tiempo real.
   */
  getFullInfoHarvest(): void {
    this.harvestService.getFullInfoHarvest().subscribe(data => {
      this.dataForSelect = data;
      this.singlebasicSelected = this.dataForSelect[0];
      this.idCategory.emit(this.singlebasicSelected);
    });
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
