import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebglRoutingModule } from './webgl-routing.module';
import { StarComponent } from './star/star.component';

@NgModule({
  declarations: [
    StarComponent
  ],
  imports: [
    CommonModule,
    WebglRoutingModule
  ]
})
export class WebglModule { }
