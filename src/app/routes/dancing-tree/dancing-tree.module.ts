import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DancingTreeRoutingModule } from './dancing-tree-routing.module';
import { DancingTreeComponent } from './dancing-tree.component';
import { GlComponent } from './gl/gl.component';
import { MusicPlayerComponent } from './music-player/music-player.component';


@NgModule({
  declarations: [
    DancingTreeComponent,
    GlComponent,
    MusicPlayerComponent,
  ],
  imports: [
    CommonModule,
    DancingTreeRoutingModule
  ]
})
export class DancingTreeModule { }
