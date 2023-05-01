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
  
  constructor(private hostRef: ElementRef<HTMLDivElement>) { 
    combineLatest([this.x$, this.y$]).subscribe(([x, y]) => {
      const width = hostRef.nativeElement.clientWidth;
      const height = hostRef.nativeElement.clientHeight
      this.hostTransform = `translate(${x - width / 2}px, ${y - height / 2}px)`;
    });
  }

  ngOnInit(): void {
  }

  explosion() {
    const tl = gsap.timeline();
    tl.set(this.hostRef.nativeElement, {
      x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
      y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
      scale: 0.3,
      boxShadow: `0 0 0px 0px #9ab3f5`,
      onUpdate: () => {
        gsap.set(this.hostRef.nativeElement, {
          x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
          y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
        })
      }
    }).to(this.hostRef.nativeElement, {
      scale: 1,
      opacity: 0.7,
      x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
      y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
      boxShadow: `0 0 10px 8px #9ab3f5`,
      duration: 0.1,
      onUpdate: () => {
        gsap.set(this.hostRef.nativeElement, {
          x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
          y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
        })
      }
    }).to(this.hostRef.nativeElement, {
      scale: 2,
      opacity: 0,
      boxShadow: `0 0 0 0 #9ab3f5`,
      x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
      y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
      onUpdate: () => {
        gsap.set(this.hostRef.nativeElement, {
          x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
          y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
        })
      }
    }).to(this.hostRef.nativeElement, {
      scale: 1,
      opacity: 1,
      x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
      y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
      duration: 0.1,
      onUpdate: () => {
        gsap.set(this.hostRef.nativeElement, {
          x: this.x$.value - this.hostRef.nativeElement.clientWidth / 2,
          y: this.y$.value - this.hostRef.nativeElement.clientHeight / 2,
        })
      }
    }) 
  }

}
