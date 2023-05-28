import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import * as three from "three";
import { Controls } from '../../script/Controls';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit, AfterViewInit {

  constructor(private hostRef: ElementRef<HTMLDivElement>) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const scene = new three.Scene();
    const camera = new three.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const webGlRenderer = new three.WebGLRenderer();
    webGlRenderer.setClearColor(new three.Color('#000'));
    webGlRenderer.setSize(window.innerWidth,  window.innerHeight);
    webGlRenderer.shadowMap.enabled = true;

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(new three.Vector3(10, 0, 0));

    this.hostRef.nativeElement.appendChild(webGlRenderer.domElement);
    
    const controls = new Controls()
    controls.redraw(scene);
    controls.render(scene, webGlRenderer, camera);
  }
}
