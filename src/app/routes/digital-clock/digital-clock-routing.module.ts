import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalClockIndexComponent } from './digital-clock-index/digital-clock-index.component';

const routes: Routes = [
    {
        path: '',
        component: DigitalClockIndexComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalClockRoutingModule { }
