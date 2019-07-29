import {Pipe, PipeTransform} from '@angular/core';
import {IFilter} from '../interfaces/question.interface';

@Pipe({
  name: 'filter'
})

export class IsAnsweredPipe implements PipeTransform {
  transform(items: any[], value: IFilter): any {
    // return items.filter(item => {
    //   let statusFlag = false;
    //   let tagFlag = false;
    //   let timeFlag = false;
    //   value.status.forEach(status => {
    //     if (status === 'answered') {
    //       return statusFlag = item.isAnswered !== false;
    //     }
    //     if (status === 'unanswered') {
    //       return statusFlag = item.isAnswered !== true;
    //     }
    //     return statusFlag = true;
    //   });
    //   value.tag.forEach(tag => {
    //     if (tag === 'all') {return tagFlag = true; }
    //     if (item.categories.includes(tag)) {
    //       return tagFlag = true;
    //     }
    //   });
    //   value.time.forEach(time => {
    //           if (item.categories.includes(tag)) {
    //             return tagFlag = true;
    //           }
    //         });
    //   return statusFlag  && tagFlag;
    // });

    // if (status === 'answered') {
    //   return filteredItems = items.filter(item => item.isAnswered === true);
    // }
    // if (status === 'unanswered') {
    //   return filteredItems = items.filter(item => item.isAnswered === false);
    // }
    //
    // value.tag.forEach(tag => {
    //   filteredItems.filter(item => item.categories.includes(tag));
    // });
    // if (value.status.includes('answered')) {
    //   return items.filter(item => item.isAnswered === value.status.includes('answered'));
    // }
    // if (value.status.includes('unanswered')) {
    //   return items.filter(item => item.isAnswered !== value.status.includes('unanswered'));
    // }
    // if (value.tag.includes('html')) {
    //   return items.filter(item => item.categories.includes('html') === value.tag.includes('html'));
    // }
    // if (value.tag.includes('css')) {
    //   return items.filter(item => item.categories.includes('css') === value.tag.includes('css'));
    // }
    // if (value.tag.includes('js')) {
    //   return items.filter(item => item.categories.includes('js') === value.tag.includes('js'));
    // }


    //   if (value === null) {
        return items;
    //   }
    //   return items.filter(i => {
    //     return i.isAnswered === value;
    //   });
  }
}
