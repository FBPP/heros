import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { World } from '@core/script/dance-tree/World';
@Component({
  selector: 'app-gl',
  templateUrl: './gl.component.html',
  styleUrls: ['./gl.component.scss']
})
export class GlComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private world!: World;
  constructor() {
  }

  ngAfterViewInit(): void {
    this.world = new World(this.canvasRef.nativeElement, window.innerWidth, window.innerHeight, { x: 0, y: 0, z: 4.5 })
    this.world.loop();
  }

  public playMusic(button: HTMLButtonElement) {
    this.world.playMusic(button);
  }
}
