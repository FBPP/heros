import { Component } from '@angular/core';
import dancingTreeVertex from '@core/gl/dancing-tree-vertex.glsl';
@Component({
  selector: 'app-gl',
  templateUrl: './gl.component.html',
  styleUrls: ['./gl.component.scss']
})
export class GlComponent {
  constructor() {
    console.log(dancingTreeVertex)
  }
}
