import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit, QueryList, HostListener } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, combineLatest, merge, interval } from 'rxjs';
import gsap from 'gsap'
import { throttleTime, bufferCount, map } from "rxjs/operators"
interface TouchInfo {
  pageY: number
}

@Component({
  selector: 'app-scroll-picker-index',
  templateUrl: './scroll-picker-index.component.html',
  styleUrls: ['./scroll-picker-index.component.scss']
})
export class ScrollPickerIndexComponent implements OnInit, AfterViewInit {
  @HostListener('touchstart', ['$event']) handleListTouchStart(event: TouchEvent) {
    if(this.tween) {
      this.tween.kill();
      this.tween = null;
    }
    this.touchStartInfo = {  pageY: event.changedTouches[0].pageY }
  }
  @HostListener('touchmove', ['$event']) handleListTouchMove(event: TouchEvent) {
    this.touchMove$.next({ 
      pageY: event.changedTouches[0].pageY 
    })
  }
  @HostListener('touchend') handleListTouchEnd() {
    this.endIndex$.next(this.calcIndex(this.currentIndex - Math.round(this.dSpeed / 2)))
  }

  @ViewChild('scroll') scrollRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('scrollItem') scrollItemRefs!: QueryList<ElementRef<HTMLDivElement>>;
  list$ = new BehaviorSubject<number[]>([])
  touchStartInfo: TouchInfo = { pageY: 0 }
  touchMove$ = new Subject<TouchInfo>()
  scrollY$ = new BehaviorSubject<number>(0)
  moveIndex$ = new BehaviorSubject<number>(0)
  endIndex$ = new BehaviorSubject<number>(0)
  currentIndex = 0;
  transformStyle = ''
  scrollItemStyleHeight = 0;
  touchEndDist = 0;
  interval = interval(1)
  dSpeed = 0;
  itemAngle = 0;
  rotateRadius$ =  new BehaviorSubject<string>('100px');
  translateStyle = 'translateY(0) translate3d(0px, 0px, 100px)'
  tween: gsap.core.Tween | null = null

  constructor() { 
    let list: number[] = []
    for(let i = 0; i < 40; ++i) list.push(i)
    this.list$.next(list)
  }

  ngOnInit(): void {
    this.touchMove$.subscribe(touchInfo => {
      this.scrollY$.next(touchInfo.pageY)
    })
    this.interval.pipe(
      map(() => {
        return this.scrollY$.value
      }),
      bufferCount(2)
    ).subscribe(scrollYs => {
      this.dSpeed = scrollYs[1] - scrollYs[0]
    })
  }

  ngAfterViewInit(): void {
    if(this.scrollItemRefs && this.scrollItemRefs.length) this.scrollItemStyleHeight = (this.scrollItemRefs.get(0) as ElementRef<HTMLDivElement>).nativeElement.offsetHeight;
    this.scrollItemRefs.changes.subscribe(scrollItemRefs => {
      this.scrollItemStyleHeight = (scrollItemRefs.get(0) as ElementRef<HTMLDivElement>).nativeElement.offsetHeight;
    })

    this.list$.subscribe(list => {
      this.itemAngle = 270 / list.length;
      console.log(this.scrollItemStyleHeight)
      const radius =  this.scrollItemStyleHeight / 2 / Math.tan(this.itemAngle * Math.PI / 180 / 2) 

      this.rotateRadius$.next(radius + 'px')
    })

    this.rotateRadius$.subscribe(rotateRadius => {
      this.translateStyle = `translateY(${this.scrollItemStyleHeight / 2}px) translate3d(0px, 0px, -${rotateRadius})`
    })

    this.scrollY$.pipe(throttleTime(16)).subscribe(scrollY => { 
      const deltaY = scrollY - this.touchStartInfo.pageY
      this.moveIndex$.next(this.calcIndex(this.endIndex$.value - Math.round(deltaY / this.scrollItemStyleHeight)))
    })
    this.moveIndex$.subscribe(moveIndex => {
      this.rotateScroll(moveIndex, 0.2)
    })
    this.endIndex$.subscribe(endIndex => {
      this.rotateScroll(endIndex, 1)
    })

    merge(this.moveIndex$, this.endIndex$).subscribe(index => this.currentIndex = index)
  }


  private rotateScroll(index: number, duration: number) {
    this.tween = gsap.to(this.scrollRef.nativeElement, {
      z: `-${this.rotateRadius$.value}`,
      y: this.scrollItemStyleHeight / 2,
      rotateX: index * this.itemAngle,
      duration: duration,
      ease: "power2.out"
    })
  }

  calcIndex(index: number) {
    if(index < 0) return 0
    if(index >= this.list$.value.length) return this.list$.value.length - 1;
    return index
  }

}
