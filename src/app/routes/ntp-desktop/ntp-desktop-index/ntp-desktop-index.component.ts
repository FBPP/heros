import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CursorComponent } from '../components/cursor/cursor.component';

@Component({
  selector: 'app-ntp-desktop-index',
  templateUrl: './ntp-desktop-index.component.html',
  styleUrls: ['./ntp-desktop-index.component.scss'],
})
export class NtpDesktopIndexComponent implements OnInit {
  @HostListener('mousemove', ['$event'])
  handleHostMouseMove(event: MouseEvent) {
    this.cursorPageX = event.pageX;
    this.cursorPageY = event.pageY;
  }
  
  @ViewChild(CursorComponent) cursorComponent: CursorComponent | null = null;

  cursorPageX = 0;
  cursorPageY = 0;

  constructor() { }

  ngOnInit(): void {
  }


  handleMenuItemClick() {
    if(this.cursorComponent) this.cursorComponent.explosion()
  }

}
