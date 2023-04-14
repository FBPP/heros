import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigitalClockRoutingModule } from './digital-clock-routing.module';
import { DigitalClockIndexComponent } from './digital-clock-index/digital-clock-index.component';

@NgModule({
  declarations: [
    DigitalClockIndexComponent
  ],
  imports: [
    CommonModule,
    DigitalClockRoutingModule,
    
  ]
})
export class DigitalClockModule { }
