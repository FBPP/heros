import { Component, ViewChild } from '@angular/core';
import { GlComponent } from './gl/gl.component';

@Component({
  selector: 'app-dancing-tree',
  templateUrl: './dancing-tree.component.html',
  styleUrls: ['./dancing-tree.component.scss']
})
export class DancingTreeComponent {
  @ViewChild(GlComponent) glComponent!: GlComponent;
  handleMusicButtonClick(button: HTMLButtonElement) {
    this.glComponent.playMusic(button);
  }
}
