export class AudioPlayer {
  private audioContext!: AudioContext;
  public audio!: HTMLAudioElement;
  public analyser!: AnalyserNode;
  constructor(
    audioPath: string
  ) {
    this.audioContext = new AudioContext();
    this.audio = new Audio(audioPath);
    const source = this.audioContext.createMediaElementSource(this.audio);
    this.analyser = this.audioContext.createAnalyser();
    source.connect(this.analyser)
    this.analyser.connect(this.audioContext.destination)
  }
}