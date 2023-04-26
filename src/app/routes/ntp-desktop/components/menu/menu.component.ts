import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { gsap } from 'gsap'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('menuListDom') 
  set menuListRef(elementRef: ElementRef<HTMLDivElement>) {
    this.menuListRef$.next(elementRef)
  }

  @ViewChild('straightLineDom')
  set straightLine(elementRef: ElementRef<HTMLDivElement>) {
    this.straightLineRef$.next(elementRef);
  }

  @Output('menu-item-click') menuItemClick = new EventEmitter<undefined>(); 
  menuList = [
    { title: "HOME"},
    { title: "ABOUT US"},
    { title: "OUR WORK"},
    { title: "CAREERS"},
    { title: "CONTACT US"},
  ]

  menuBtnActive = false;
  private menuBtnClickEvent$ = new Subject<undefined>()
  private menuListRef$ = new BehaviorSubject<ElementRef<HTMLDivElement> | null>(null);
  private straightLineRef$ = new BehaviorSubject<ElementRef<HTMLDivElement> | null>(null);

  constructor() { 
    combineLatest([this.menuBtnClickEvent$.pipe(throttleTime(300)), this.menuListRef$, this.straightLineRef$])
    .subscribe(([, menuListRef, straightLineRef]) => {
      if(menuListRef && menuListRef.nativeElement && straightLineRef && straightLineRef.nativeElement) {
        this.menuBtnActive = !this.menuBtnActive;
        if(this.menuBtnActive) {
          gsap.to(straightLineRef.nativeElement, {
            height: '100vh',
            duration: 0.3
          })
          gsap.to(menuListRef.nativeElement, {
            display: 'block',
            duration: 0.3
          })
        }
        else {
          gsap.to(straightLineRef.nativeElement, {
            height: '0vh',
            duration: 0.2
          })
          gsap.to(menuListRef.nativeElement, {
            display: 'none',
            duration: 0.2
          })
        }
      }
    })
  }

  ngOnInit(): void {
  }

  handleMenuBtnClick() {
    this.menuBtnClickEvent$.next();
  }

  handleMenuItemClick() {
    this.menuItemClick.emit();
  }
}
