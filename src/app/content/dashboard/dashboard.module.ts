import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowDataComponent } from './show-data/show-data.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';


@NgModule({
  declarations: [
    ShowDataComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: 'show-data',
        component: ShowDataComponent,
      },
    ]),
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
