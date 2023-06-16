import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DancingTreeComponent } from './dancing-tree.component';

const routes: Routes = [
  {
    path: '',
    component: DancingTreeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DancingTreeRoutingModule { }
