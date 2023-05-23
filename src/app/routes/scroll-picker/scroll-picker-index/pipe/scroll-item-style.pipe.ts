import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scrollItemStyle',
  pure: true,
})
export class ScrollItemStylePipe implements PipeTransform {

  transform(value: number, itemAngle: number, rotateRadius: string, currentIndex: number): { [key: string]: string} {
    let opaicty = (4 - Math.abs(currentIndex - value)) / 4
    return {
      'transform' : `translateY(-50%) rotate3d(1, 0, 0, -${itemAngle * value}deg) translate3d(0px, 0px, ${rotateRadius})`,
      // 'opacity': opaicty.toString(),
    }
  }

}
