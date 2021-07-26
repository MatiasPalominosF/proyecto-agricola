import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDatePipe } from './filter-date/filter-date.pipe';



@NgModule({
  declarations: [
    FilterDatePipe
  ],
  exports: [FilterDatePipe],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
