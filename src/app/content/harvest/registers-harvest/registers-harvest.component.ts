import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-registers-harvest',
  templateUrl: './registers-harvest.component.html',
  styleUrls: ['./registers-harvest.component.css']
})
export class RegistersHarvestComponent implements OnInit {
  @Input() public id: string;
  constructor() { }

  ngOnInit(): void {
    console.log("ID: " + this.id)
  }

}
