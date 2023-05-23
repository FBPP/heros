import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollPickerRoutingModule } from './scroll-picker-routing.module';
import { ScrollPickerIndexComponent } from './scroll-picker-index/scroll-picker-index.component';
import { ScrollItemStylePipe } from './scroll-picker-index/pipe/scroll-item-style.pipe';


@NgModule({
  declarations: [
    ScrollPickerIndexComponent,
    ScrollItemStylePipe,
  ],
  imports: [
    CommonModule,
    ScrollPickerRoutingModule,
  ]
})
export class ScrollPickerModule { }
