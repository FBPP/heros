import { Component, ElementRef, ViewChild } from "@angular/core"
import { RecordImgComponent } from "src/app/routes/music/record-img/record-img.component";
import { AudioPlayer } from "./AudioPlayer";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { tap, throttleTime } from "rxjs/operators"
import { SpectrumDrawer } from "./SpectrumDrawer";

export enum PlayState {
  PLAYING = 'PLAYING',
  PAUSE = 'PAUSE'
}

export interface PlayStateWrap {
  state: PlayState,
  text: string
}

@Component({
  template: ''
})
export class BaseFrequency {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>
  @ViewChild(RecordImgComponent) recordImgComponent!: RecordImgComponent; 
  protected audioPlayer: AudioPlayer | null = null;
  PlayState = PlayState;
  playStates: { [key: string]: PlayStateWrap } = {
    [PlayState.PLAYING]: {
      state: PlayState.PLAYING,
      text: '暂停',
    },
    [PlayState.PAUSE]: {
      state: PlayState.PAUSE,
      text: '播放',
    }
  }
  play$ = new Subject<boolean>();
  animationFrame$ = new BehaviorSubject<null | number>(null);
  currentPlayState: PlayStateWrap = this.playStates[PlayState.PAUSE];
  drawer: SpectrumDrawer | null = null;
  protected throttleTime = 0

  protected subscribePlay() {
    combineLatest([this.play$.pipe(
      tap(play => {
        const audioPlayer =  this.createAudioPlayer()
        if(play) {
          this.currentPlayState = this.playStates[this.PlayState.PLAYING]
          audioPlayer.audio.play()
        } else {
          this.currentPlayState = this.playStates[this.PlayState.PAUSE]
          audioPlayer.audio.pause()
        }
      })
      ), this.animationFrame$]
    ).pipe(
      tap(([play]) => {
        if(play && this.audioPlayer) {
          requestAnimationFrame((timeStep) => this.animationFrame$.next(timeStep))
          this.recordImgComponent.rotateRecordImage()
        }
      }),
      throttleTime(this.throttleTime)
    ).subscribe(([play, timestamp]) => {
      if(this.drawer && this.audioPlayer) {
        this.drawer.draw(this.audioPlayer.analyser, timestamp)
      }
    })
  
  }

  protected createAudioPlayer() {
    if(!this.audioPlayer) this.audioPlayer = new AudioPlayer('../../../../assets/audio/audio.mp3')
    return this.audioPlayer;
  }
}