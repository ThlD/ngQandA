import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortByDate'
})

export class SortByDatePipe implements PipeTransform {
  transform(items: any[], direction: boolean): any {
    if (items.length === 0) {
      return items;
    }
    if (direction === true) {
      return items.sort((a, b) => {
        return b.date.toDate() - a.date.toDate();
      });
    }
    if (direction === false) {
      return items.sort((a, b) => {
        return a.date.toDate() - b.date.toDate();
      });
    }
  }
}
