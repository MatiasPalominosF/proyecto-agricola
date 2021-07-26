import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDatePipe } from './filter-date/filter-date.pipe';
import { FilterDate2Pipe } from './filter-date2/filter-date2.pipe';



@NgModule({
  declarations: [
    FilterDatePipe,
    FilterDate2Pipe
  ],
  exports: [
    FilterDatePipe,
    FilterDate2Pipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
