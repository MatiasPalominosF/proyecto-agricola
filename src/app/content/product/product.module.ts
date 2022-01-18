import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateProductComponent } from './update-product/update-product.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UpdateProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'update-product/:puid',
        component: UpdateProductComponent,
      },
    ]),
  ]
})
export class ProductModule { }
