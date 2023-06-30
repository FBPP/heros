import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PullDownToRefreshIndexComponent } from './pull-down-to-refresh-index/pull-down-to-refresh-index.component';

const routes: Routes = [{
  path: '',
  component: PullDownToRefreshIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PullDownToRefreshRoutingModule { }
