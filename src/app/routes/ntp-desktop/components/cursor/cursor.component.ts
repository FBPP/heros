import { Component, HostBinding, Input, OnInit, ElementRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from "rxjs"
import { gsap } from "gsap"
@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.scss']
})
export class CursorComponent implements OnInit {
  @HostBinding("style.transform") hostTransform: string = `translate(0, 0)`;

  @Input('x') 
  set x(value: number)  {
    this.x$.next(value)  
  }

  @Input('y')
  set y(value: number) {
    this.y$.next(value)
  }
  private x$ = new BehaviorSubject<number>(0);
  private y$ = new BehaviorSubject<number>(0);
  
  constructor(hostRef: ElementRef<HTMLDivElement>) { 
    combineLatest([this.x$, this.y$]).subscribe(([x, y]) => {
      const width = hostRef.nativeElement.clientWidth;
      const height = hostRef.nativeElement.clientHeight
      this.hostTransform = `translate(${x - width / 2}px, ${y - height / 2}px)`;
    });
  }

  ngOnInit(): void {
  }

  explosion() {
    
  }

}
