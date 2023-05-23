import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollPickerIndexComponent } from './scroll-picker-index/scroll-picker-index.component';

const routes: Routes = [
  {
    path: '',
    component: ScrollPickerIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrollPickerRoutingModule { }
