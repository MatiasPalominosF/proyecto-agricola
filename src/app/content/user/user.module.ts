import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewComponent } from './user-view/user-view.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    UserViewComponent,
  ],
  imports: [
    CommonModule,    
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: 'user-view',
        component: UserViewComponent,
      },
    ]),
  ]
})
export class UserModule { }
