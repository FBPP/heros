import { Component } from '@angular/core';

@Component({
  selector: 'app-gl',
  templateUrl: './gl.component.html',
  styleUrls: ['./gl.component.scss']
})
export class GlComponent {
  vertexShader = `
    uniform float uTime;
    uniform float uSize;
    
    attribute float aScale;
    attribute vec3 aColor;
    attribute float phi;
    attribute float random;

    varying vec2 vUv;
    varying vec3 vColor;

    void main() {
      float angle = phi;
      angle += uTime * random;
      angle = mod(angle, 39.3);
      float radius = 0.065 * angle;
      float rand = (random - 0.5) * 0.05 * pow(angle, 0.75);
    }
  `
}
