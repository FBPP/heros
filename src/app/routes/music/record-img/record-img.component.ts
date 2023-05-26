import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import gsap from "gsap";

@Component({
  selector: 'app-record-img',
  templateUrl: './record-img.component.html',
  styleUrls: ['./record-img.component.scss']
})
export class RecordImgComponent implements OnInit {
  @ViewChild('recordImg') recordImgRef!: ElementRef<HTMLImageElement>
  constructor() { }

  ngOnInit(): void {
  }

  public rotateRecordImage() {
    gsap.to(this.recordImgRef.nativeElement, {
      rotate: '+=2',
      duration: 0.1,
      ease: 'none',
    });
  }

}
