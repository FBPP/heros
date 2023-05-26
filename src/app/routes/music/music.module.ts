import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusicRoutingModule } from './music-routing.module';
import { MusicComponent } from './music/music.component';
import { AnnularFrequencySpectrumComponent } from './annular-frequency-spectrum/annular-frequency-spectrum.component';
import { ParticalFrequenceComponent } from './partical-frequence/partical-frequence.component';
import { RecordImgComponent } from './record-img/record-img.component';


@NgModule({
  declarations: [
    MusicComponent,
    AnnularFrequencySpectrumComponent,
    ParticalFrequenceComponent,
    RecordImgComponent
  ],
  imports: [
    CommonModule,
    MusicRoutingModule
  ]
})
export class MusicModule { }
