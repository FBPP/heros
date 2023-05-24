import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-rxjs-exercise-index',
  templateUrl: './rxjs-exercise-index.component.html',
  styleUrls: ['./rxjs-exercise-index.component.scss']
})
export class RxjsExerciseIndexComponent implements OnInit {
  mouseDown$ = new Subject<MouseEvent>()
  mouseMove$ = new Subject<MouseEvent>()
  mouseUp$ = new Subject<MouseEvent>()
  @ViewChild('box') boxRef!: ElementRef<HTMLDivElement>
  constructor() { }

  ngOnInit(): void {
    this.mouseDown$.pipe(
      map(event => {
        return {
          position: this.getPosition(this.boxRef)
        }
      })
    ).subscribe(() => {
      this.boxRef.nativeElement.style.transform = 'translate(123px, 123px)'
    })
  }

  handleBoxMouseDown(event: MouseEvent) {
    this.mouseDown$.next(event)
  }

  handleBoxMouseMove(event: MouseEvent) {
    this.mouseMove$.next(event)
  }

  handleBoxMouseUp(event: MouseEvent) {
    this.mouseDown$.next(event)
  }

  private getPosition<ElementType extends HTMLElement>(ref: ElementRef<ElementType>) {
    const regExp = /matrix\((\d+,\s){4}(\d+),\s(\d+)/i
    const computedStyle = getComputedStyle(ref.nativeElement)
    const regRes = computedStyle.transform.match(regExp)
    if(regRes) {
      return {
        x: regRes.
      }
    }
  }
}
