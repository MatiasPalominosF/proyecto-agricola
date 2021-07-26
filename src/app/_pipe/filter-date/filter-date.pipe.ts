import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDate'
})
export class FilterDatePipe implements PipeTransform {

  transform(row?: any, f1?: Date, f2?: Date): any {
    if (row == null) {
      return;
    }
    f1.toString().length == 0 ? f1 = new Date() : f1;
    f2 == null ? f2 = new Date() : f2;
    if (f1 >= f2 || f1 == null) { return row; }
    return row.filter(x => {
      return new Date(x.dateEnd.toDate()) >= new Date(f1) && new Date(x.dateEnd.toDate()) <= new Date(f2)
    });
  }

}
