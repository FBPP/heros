import { Position } from "../common/Position";


export class Partical {
  private timestamp: number | null = null;
  private x: number = 0;
  private y: number = 0;
  private speed: number = 20;
  public isDied = false;
  private totalDist = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private startPosition: Position,
    private endPosition: Position,
    private direction: number,
    private radius: number = 2,
  ) {
    this.x = this.startPosition.x;
    this.y = this.startPosition.y;
    this.totalDist = Math.sqrt((endPosition.x - this.startPosition.x) ** 2 + (endPosition.y - this.startPosition.y) ** 2)
  }

  draw(color: string) {
    this.ctx.fillStyle = color;
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    this.ctx.fill();
  }

  move(timestamp: number | null) {
    if(!timestamp || !this.timestamp) {
      this.draw("skyblue")
      this.timestamp = timestamp;
    } else {
      const timeDelta = timestamp - this.timestamp;
      let moveDist = timeDelta / 1000 * this.speed;
      console.log(moveDist)
      if(moveDist > this.totalDist) {
        moveDist = this.totalDist;
        this.isDied = true;
      }
      this.totalDist -= moveDist;
      this.x = this.x + moveDist * Math.cos(this.direction);
      this.y = this.y + moveDist * Math.sin(this.direction); 
      this.draw('skyblue')
    }
  }

}