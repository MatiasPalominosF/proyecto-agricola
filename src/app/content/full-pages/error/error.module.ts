import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAllowedComponent } from './not-allowed/not-allowed.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NotAllowedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'not-allowed',
        component: NotAllowedComponent,
      }
    ]
    )
  ]
})
export class ErrorModule { }
