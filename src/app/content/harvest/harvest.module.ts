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
import { RegistersUsersComponent } from './registers-users/registers-users.component';
import { HarvestEditComponent } from './harvest-edit/harvest-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    HarvestsViewComponent,
    RegistersHarvestComponent,
    RegistersUsersComponent,
    HarvestEditComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CardModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
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
      {
        path: 'registers-users',
        component: RegistersUsersComponent,
      },
    ]),
  ]
})
export class HarvestModule { }
