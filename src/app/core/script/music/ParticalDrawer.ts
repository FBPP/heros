import { BaseDrawer } from "./BaseDrawer";
import { Partical } from "./Partical";
export class ParticalDrawer extends BaseDrawer {
  private particals: Partical[] = [];
  
  draw(analyser: AnalyserNode, timestamp: number | null) {
    if(!this.ctx) return;
    const byteFrequenceData = new Uint8Array(360)
    analyser.getByteFrequencyData(byteFrequenceData)
    const maxFrequence = this.findMaxFrequence(byteFrequenceData)
    this.ctx.clearRect(0, 0, this.width, this.height);
    for(let i = 0; i < 360; i += 10) {
      const value = this.linearInterpolation(byteFrequenceData[Math.round(i)], 0, maxFrequence, 1, 100);
      console.log(value)
      const direction = i / 360 * Math.PI * 2;
      const startPosition = {
        x: this.radius * Math.cos(direction) + this.center.x,
        y: this.radius * Math.sin(direction) + this.center.y,
      };

      const endPosition = {
        x: (this.radius + value) * Math.cos(direction) + this.center.x,
        y: (this.radius + value) * Math.sin(direction) + this.center.y,
      };

      this.particals.push(new Partical(this.ctx, startPosition, endPosition, direction))
    }

    for(const partical of this.particals) {
      partical.move(timestamp);
    }
    for(let i = 0; i < this.particals.length; ++i) {
      if(this.particals[i].isDied) {
        console.log('xxxxx')
        this.particals.splice(i, 1);
      }
    }
  }
}