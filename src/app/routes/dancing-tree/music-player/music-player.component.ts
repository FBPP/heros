import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from "three";

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent {
  @ViewChild('musicButton') musicButtonRef!: ElementRef<HTMLButtonElement>;
  @Output() playButtonClick = new EventEmitter<HTMLButtonElement>()
  public handlePlayButtonClick() {
    this.playButtonClick.emit(this.musicButtonRef.nativeElement)
  }
}
