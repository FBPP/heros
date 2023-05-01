import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NTPDesktopRoutingModule } from './ntp-desktop-routing.module';
import { NtpDesktopIndexComponent } from './ntp-desktop-index/ntp-desktop-index.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { MenuComponent } from './components/menu/menu.component';
import { BackgroundComponent } from './components/background/background.component';


@NgModule({
  declarations: [
    NtpDesktopIndexComponent,
    CursorComponent,
    MenuComponent,
    BackgroundComponent
  ],
  imports: [
    CommonModule,
    NTPDesktopRoutingModule
  ]
})
export class NTPDesktopModule { }
