export abstract class Renderer {
  public abstract render(timeDelta: number): void;
}

export class Animation {
  private now!: DOMHighResTimeStamp
  constructor(private renderer: Renderer) {
    this.now = Date.now()
    this.render(this.now);
  }
  private render(timeStamp: number) {
    const timeDelta = timeStamp - this.now;
    this.now = timeStamp;
    this.renderer.render(timeDelta)
    requestAnimationFrame((time) => { this.render(time) })
  }
}