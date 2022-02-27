import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContractInfo } from 'src/app/_models/contractInfo';
import { CryptoService } from 'src/app/_services/cryptodata/crypto.service';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-export-contract',
  templateUrl: './export-contract.component.html',
  styleUrls: ['./export-contract.component.css']
})
export class ExportContractComponent implements OnInit {
  @ViewChild('pdfContent') pdfTable!: ElementRef;
  
  public user: ContractInfo = {};

  public nameCompany: string;
  public firstNameWorker: string;
  public lastNameWorker: string;
  public addressWorker: string;
  public cityWorker: string;
  public runWorker: string;
  public stateWorker: string;
  public emailWorker: string;
  public rolWorker: string;
  public firstNameOwnerCompany: string;
  public lastNameOwnerCompany: string;
  public addressOwnerCompany: string;
  public cityOwnerCompany: string;
  public stateOwnerCompany: string;
  public runOwnerCompany: string;
  public runCompany: string;
  public addressCompany: string;
  public cityCompany: string;
  public stateCompany: string;
  public admissionDate: any;
  public emailCompany: string;

  public currentDate: Date = new Date();

  constructor(
    private crypto: CryptoService,
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    let encryptData = localStorage.getItem('contract');
    this.user = this.crypto.decryptData(encryptData);

    this.nameCompany = this.user.nameCompany;
    this.firstNameWorker = this.user.firstNameWorker;
    this.lastNameWorker = this.user.lastNameWorker;
    this.addressWorker = this.user.addressWorker;
    this.cityWorker = this.user.cityWorker;
    this.runWorker = this.user.runWorker;
    this.stateWorker = this.user.stateWorker;
    this.emailWorker = this.user.emailWorker;
    this.rolWorker = this.setRol(this.user.rolWorker);
    this.firstNameOwnerCompany = this.user.firstNameOwnerCompany;
    this.lastNameOwnerCompany = this.user.lastNameOwnerCompany;
    this.addressOwnerCompany = this.user.addressOwnerCompany;
    this.cityOwnerCompany = this.user.cityOwnerCompany;
    this.stateOwnerCompany = this.user.stateOwnerCompany;
    this.runOwnerCompany = this.user.runOwnerCompany;
    this.runCompany = this.user.runCompany;
    this.addressCompany = this.user.addressCompany;
    this.cityCompany = this.user.cityCompany;
    this.stateCompany = this.user.stateCompany;
    this.admissionDate = this.user.admissionDate;
    this.emailCompany = this.user.emailCompany;
  }
  setRol(rol: string): string {
    if (rol === 'admin') {
      return 'administrador';
    }
    else if (rol === 'worker') {
      return 'trabajador';
    }
    else if (rol === 'planner') {
      return 'planillero';
    }
    else if (rol === 'harvester') {
      return 'cosechador';
    }
  }

  exportToPdf() {
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();
  }
}
