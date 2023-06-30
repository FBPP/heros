import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableFlippingRoutingModule } from './table-flipping-routing.module';
import { TableFlippingIndexComponent } from './table-flipping-index/table-flipping-index.component';


@NgModule({
  declarations: [
    TableFlippingIndexComponent
  ],
  imports: [
    CommonModule,
    TableFlippingRoutingModule
  ]
})
export class TableFlippingModule { }
