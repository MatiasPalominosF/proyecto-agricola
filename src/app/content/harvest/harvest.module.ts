import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarvestsViewComponent } from './harvests-view/harvests-view.component';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HarvestsViewComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: 'harvests-view',
        component: HarvestsViewComponent,
      },
    ]),
  ]
})
export class HarvestModule { }
