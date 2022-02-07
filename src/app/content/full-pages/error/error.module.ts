import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAllowedComponent } from './not-allowed/not-allowed.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    NotAllowedComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'not-allowed',
        component: NotAllowedComponent,
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      }
    ]
    )
  ]
})
export class ErrorModule { }
