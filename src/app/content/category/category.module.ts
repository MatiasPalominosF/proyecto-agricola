import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    CategoriesListComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: 'categories-list',
        component: CategoriesListComponent,
      },
    ])
  ]
})
export class CategoryModule { }
