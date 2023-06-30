import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableFlippingIndexComponent } from './table-flipping-index/table-flipping-index.component';

const routes: Routes = [{
  path: '',
  component: TableFlippingIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableFlippingRoutingModule { }
