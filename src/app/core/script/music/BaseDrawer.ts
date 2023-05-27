import { Position } from "../common/Position";

export abstract class BaseDrawer {
  protected ctx:  CanvasRenderingContext2D | null;
  protected center: Position = {x: 0, y: 0};
  constructor(
    private container: HTMLCanvasElement, 
    protected width: number,
    protected height: number,
    protected radius: number,
  ) {
    this.container.width = width;
    this.container.height = height;
    this.container.style.width = `${width}px`;
    this.container.style.height = `${height}px`;
    this.ctx = this.container.getContext('2d')
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    }
  }
  
  abstract draw(analyser: AnalyserNode, timestamp: number | null): void;

  protected findMaxFrequence(byteFrequenceData: Uint8Array) {
    let maxValue = 0;
    for(const frequence of byteFrequenceData) {
      maxValue = Math.max(maxValue, frequence)
    }
    return maxValue;
  }

  protected linearInterpolation(value: number, min: number, max: number, start: number, end: number) {
    console.log(value)
    if(max - min == 0) return 0;
    return (value - min) / (max - min) * (end - start) + start;
  }
}