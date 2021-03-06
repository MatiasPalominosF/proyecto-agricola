import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModule } from './error/error.module';
import { ContractModule } from './contract/contract.module';
import { FullPagesRoutingModule } from './full-pages-routing.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FullPagesRoutingModule,
    ErrorModule,
    ContractModule,
  ],
  exports: [RouterModule]
})
export class FullPagesModule { }
