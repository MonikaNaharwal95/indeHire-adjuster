import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificationFilter'
})
export class NotificationFilterPipe implements PipeTransform {

  transform(list: any[], pos: number): any[] {
    const d = new Date();
    if (!list) { return []; }

    return list.filter(it => {
      const d1 = new Date(it.createdDate);
      if (d.getFullYear() === d1.getFullYear() && d.getMonth() === d1.getMonth() && d.getDate() === d1.getDate()) {
        return pos === 1;
      } else {
        return pos === 2;
      }
    });
  }

}
