import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarvestsViewComponent } from './harvests-view/harvests-view.component';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { CardModule } from '../partials/general/card/card.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '../../_pipe/pipe.module';
import { RegistersHarvestComponent } from './registers-harvest/registers-harvest.component';

@NgModule({
  declarations: [
    HarvestsViewComponent,
    RegistersHarvestComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CardModule,
    NgbModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: 'harvests-view',
        component: HarvestsViewComponent,
      },
      {
        path: 'registers-harvest',
        component: RegistersHarvestComponent,
      },
    ]),
  ]
})
export class HarvestModule { }
