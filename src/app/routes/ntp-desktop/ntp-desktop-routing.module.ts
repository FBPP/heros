import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NtpDesktopIndexComponent } from './ntp-desktop-index/ntp-desktop-index.component';

const routes: Routes = [
  {
    path: '',
    component: NtpDesktopIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NTPDesktopRoutingModule { }
