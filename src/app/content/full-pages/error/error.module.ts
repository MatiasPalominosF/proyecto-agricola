import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAllowedComponent } from './not-allowed/not-allowed.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { DisabledViewComponent } from './disabled-view/disabled-view.component';

@NgModule({
  declarations: [
    NotAllowedComponent,
    NotFoundComponent,
    DisabledViewComponent
  ],
  exports: [
    RouterModule,
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
      },
      {
        path: 'user-disabled',
        component: DisabledViewComponent,
      }
    ]
    )
  ]
})
export class ErrorModule { }
