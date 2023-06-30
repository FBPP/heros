import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { PullDownToRefreshRoutingModule } from './pull-down-to-refresh-routing.module';
import { PullDownToRefreshIndexComponent } from './pull-down-to-refresh-index/pull-down-to-refresh-index.component';


@NgModule({
  declarations: [
    PullDownToRefreshIndexComponent
  ],
  imports: [
    CommonModule,
    PullDownToRefreshRoutingModule,
    FontAwesomeModule
  ]
})
export class PullDownToRefreshModule { }
