import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SpectrumDrawer } from 'src/app/core/script/music/SpectrumDrawer';
import { BaseFrequency } from 'src/app/core/script/music/BaseFrequency';



@Component({
  selector: 'app-annular-frequency-spectrum',
  templateUrl: './annular-frequency-spectrum.component.html',
  styleUrls: ['./annular-frequency-spectrum.component.scss']
})
export class AnnularFrequencySpectrumComponent extends BaseFrequency implements OnInit, AfterViewInit {
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawer = new SpectrumDrawer(this.canvasRef.nativeElement, 400, 400, 150);
    this.subscribePlay()
  }

  handlePlayButtonClick() {
    this.play$.next(false);
  }

  handlePlayPauseClick() {
    this.play$.next(true);
  }
}
