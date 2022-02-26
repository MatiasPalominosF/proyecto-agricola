import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInterface } from 'src/app/_models/user';

@Component({
  selector: 'app-export-contract',
  templateUrl: './export-contract.component.html',
  styleUrls: ['./export-contract.component.css']
})
export class ExportContractComponent implements OnInit, OnDestroy {
  public user: UserInterface = {};
  constructor() {
  }
  ngOnDestroy(): void {
    console.log("murió");
  }


  ngOnInit(): void {
    console.log("this.user ", this.user);
  }

}
