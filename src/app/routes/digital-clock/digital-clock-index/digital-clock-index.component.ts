import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DigitalClock } from '../script/DigitalClock';

@Component({
  selector: 'app-digital-clock-index',
  templateUrl: './digital-clock-index.component.html',
  styleUrls: ['./digital-clock-index.component.scss']
})
export class DigitalClockIndexComponent implements OnInit, AfterViewInit {
  @ViewChild("clock") clockRef!: ElementRef<HTMLDivElement>
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    new DigitalClock(this.clockRef.nativeElement);
  }

}
