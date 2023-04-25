import { Component, HostListener, OnInit } from '@angular/core';

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
  cursorPageX = 0;
  cursorPageY = 0;

  constructor() { }

  ngOnInit(): void {
  }

  handleMousemove() {

  }

}
