import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subject, of, zip, interval } from 'rxjs'
import { map, switchMap, takeUntil, tap, startWith, mergeMap } from 'rxjs/operators'
import gsap from "gsap"

interface Position {
  x: number,
  y: number
}

@Component({
  selector: 'app-rxjs-exercise-index',
  templateUrl: './rxjs-exercise-index.component.html',
  styleUrls: ['./rxjs-exercise-index.component.scss']
})
export class RxjsExerciseIndexComponent implements OnInit, AfterViewInit {
  mouseDown$ = new Subject<MouseEvent>()
  mouseMove$ = new Subject<MouseEvent>()
  stop$ = new Subject()
  
  boxPosition$ = new BehaviorSubject<Position>({x: 0, y: 0})
  boxRotate$ = new Subject()

  @ViewChild('headBox') headBoxRef!: ElementRef<HTMLDivElement>

  @ViewChildren('box') boxRefs!: QueryList<ElementRef<HTMLDivElement>>

  boxRotateTween: gsap.core.Timeline | null = null

  boxs = [{
    backgroundColor: "#f38507",
  },{
    backgroundColor: "#e8c110",
  }, {
    backgroundColor: "#70fa0d",
  }, {
    backgroundColor: "#19f0f7",
  }, {
    backgroundColor: "#d919f7",
  }, {
    backgroundColor: "#1deee3",
  }, {
    backgroundColor: "#f51c81",
  }]
  constructor() { }

  ngOnInit(): void {

    this.boxPosition$.subscribe((boxPosition) => {
      if(this.headBoxRef && this.headBoxRef.nativeElement)
      gsap.set(this.headBoxRef.nativeElement, {
        x: boxPosition.x,
        y: boxPosition.y,
      });
    })

    this.boxRotate$.subscribe(() => {
      const tl = gsap.timeline({ repeat: -1, defaults: { 
        duration: 0.1, ease: 'none', 
      }})
      this.boxRotateTween = tl.to(this.headBoxRef.nativeElement, {
        rotate: 10,
      }).to(this.headBoxRef.nativeElement, {
        rotate: 0,
      }).to(this.headBoxRef.nativeElement, {
        rotate: -10,
      }).to(this.headBoxRef.nativeElement, {
        rotate: 0,
      })
    })
  }

  ngAfterViewInit(): void {
    this.startDragSubscribe()
    this.boxRefs.changes.subscribe(() => {
      this.startDragSubscribe()
    })
  }

  handleBoxMouseDown(event: MouseEvent) {
    this.mouseDown$.next(event)
  }

  handleBoxMouseMove(event: MouseEvent) {
    this.mouseMove$.next(event)
  }

  handleBoxMouseUp() {
    this.stop$.next()
  }

  handleMouseLeave() {
    this.stop$.next()
  } 

  startDragSubscribe() {
    const delayBoxes$ = zip(of(this.headBoxRef,...this.boxRefs), interval(100).pipe(startWith(0))).pipe(
      map(([boxRef, _]) => boxRef ))
    this.mouseDown$.pipe(
      map(event => {
        return {
          position: this.getPosition(this.headBoxRef),
          event
        }
      }),
      switchMap((initState) => {
        return this.mouseMove$.pipe(
          map(event => ({
            x: event.clientX - initState.event.clientX + initState.position.x,
            y: event.clientY - initState.event.clientY + initState.position.y
          })),
          takeUntil(this.stop$)
        )
      }),
      mergeMap(pos => {
        return delayBoxes$.pipe(tap((boxRef) => {
          gsap.set(boxRef.nativeElement, {
            x: pos.x,
            y: pos.y,
          });
        }))
      })
    ).subscribe(() => {
    })
  }

  private getPosition<ElementType extends HTMLElement>(ref: ElementRef<ElementType>) {
    const computedStyle = getComputedStyle(ref.nativeElement)
    if(computedStyle.transform) {
      const startIndex = computedStyle.transform.indexOf('(')
      if(startIndex !== -1) {
        const lastIndex =  computedStyle.transform.indexOf(')')
        const str = computedStyle.transform.substring(startIndex + 1, lastIndex)
        const numbers = str.split(',').map(numberStr => Number(numberStr.trim()))
        return  {x: numbers[4], y: numbers[5]}
      } 
      return {x: 0, y: 0}
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }

  private stopShakeBox() {
    if(this.boxRotateTween) this.boxRotateTween.kill()
    this.boxRotateTween = null;
    gsap.set(this.headBoxRef.nativeElement, {
      rotate: 0
    })
  }
}
