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

  public singleSelectArray = [
    {
      "item_id": 1, "item_text": "Alaska"
    },
    {
      "item_id": 2, "item_text": "California"
    },
    {
      "item_id": 3, "item_text": "Colorado"
    },
    {
      "item_id": 4, "item_text": "New Mexico"
    },
    {
      "item_id": 5, "item_text": "Alabama"
    },
    {
      "item_id": 6, "item_text": "Connecticut"
    },
    {
      "item_id": 7, "item_text": "New York"
    }
  ];
  public dataForSelect: Harvest[];
  public dataForSelect2: Array<Harvest> = [];
  public singlebasicSelected: Harvest;
  @BlockUI('selectBlockUi') blockUISelect: NgBlockUI;
  constructor(
    private harvestService: HarvestService,
  ) { }

  @Input() breadcrumb: object;
  @Output() idCategory = new EventEmitter<Harvest>();

  ngOnInit() {
    this.processBreadCrumbLinks();
    this.getFullInfoHarvest();
    //this.a();
  }
  private processBreadCrumbLinks() {
  }

  getFullInfoHarvest(): void {
    this.blockUISelect.start("Cargando...");
    this.harvestService.getFullInfoHarvest().subscribe(data => {
      //console.log("DATA", data);
      this.dataForSelect = data;
      this.singlebasicSelected = this.dataForSelect[0];
      this.idCategory.emit(this.singlebasicSelected);
      //this.harvests = data;
      this.blockUISelect.stop();
    });
  }

  a() {
    this.harvestService.getFullInHarvest().then((data => {
      data.forEach(element => {
        this.dataForSelect2.push(element.data());
      });
    })).finally(() => {
      this.dataForSelect = this.dataForSelect2;
      console.log("dataForSelect", this.dataForSelect);
      this.singlebasicSelected = this.dataForSelect[0];
      console.log("singlebasicSelected", this.singlebasicSelected);
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
