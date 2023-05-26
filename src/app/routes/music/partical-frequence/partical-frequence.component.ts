import { Component, OnInit } from '@angular/core';
import { BaseFrequency } from 'src/app/core/script/music/BaseFrequency';
import { ParticalDrawer } from 'src/app/core/script/music/ParticalDrawer';

@Component({
  selector: 'app-partical-frequence',
  templateUrl: './partical-frequence.component.html',
  styleUrls: ['./partical-frequence.component.scss']
})
export class ParticalFrequenceComponent extends BaseFrequency implements OnInit {
  constructor() {
    super();
    this.throttleTime = 10000
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawer = new ParticalDrawer(this.canvasRef.nativeElement, 400, 400, 150);
    this.subscribePlay()
  }

  handlePlayButtonClick() {
    this.play$.next(false);
  }

  handlePlayPauseClick() {
    this.play$.next(true);
  }
}
