import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportContractComponent } from './export-contract/export-contract.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ExportContractComponent
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'export-contract',
        component: ExportContractComponent
      },
    ]),
  ]
})
export class ContractModule { }
