import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInterface } from 'src/app/_models/user';
import { CryptoService } from 'src/app/_services/cryptodata/crypto.service';

@Component({
  selector: 'app-export-contract',
  templateUrl: './export-contract.component.html',
  styleUrls: ['./export-contract.component.css']
})
export class ExportContractComponent implements OnInit, OnDestroy {
  public user: UserInterface = {};
  constructor(
    private crypto: CryptoService,
  ) {
  }

  ngOnDestroy(): void {
    localStorage.removeItem('contract');
  }

  ngOnInit(): void {
    this.getData();
    console.log("this.user ", this.user);
  }

  getData() {
    let encryptData = localStorage.getItem('contract');
    this.user = this.crypto.decryptData(encryptData);

  }

}
