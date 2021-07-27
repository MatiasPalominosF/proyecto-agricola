import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  singlebasicSelected: any;

  constructor() { }

  @Input() breadcrumb: object;
  @Output() idCategory = new EventEmitter<String>();

  ngOnInit() {
    this.processBreadCrumbLinks();
    this.singlebasicSelected = this.singleSelectArray[0].item_text;
    this.idCategory.emit(this.singlebasicSelected);
  }
  private processBreadCrumbLinks() {
  }

  change($event): void {
    this.singlebasicSelected = $event.item_text;
    this.idCategory.emit(this.singlebasicSelected);
  }
}
