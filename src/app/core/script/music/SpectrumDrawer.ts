import { BaseDrawer } from "./BaseDrawer";

export class SpectrumDrawer extends BaseDrawer {
  draw(analyser: AnalyserNode, timestamp: number | null) {
    if(!this.ctx) return;
    const byteFrequenceData = new Uint8Array(360)
    analyser.getByteFrequencyData(byteFrequenceData)
    const maxFrequence = this.findMaxFrequence(byteFrequenceData)
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = '#aa0be4'
    for(let i = 0; i < 360; i += 1.5) {
      const value = this.linearInterpolation(byteFrequenceData[Math.round(i)], 0, maxFrequence, 1, 15);
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(
        Math.cos(i / 180 * Math.PI) * this.radius + this.center.x,
        Math.sin(i / 180 * Math.PI) * this.radius + this.center.y
      )
      this.ctx.lineTo(
        Math.cos(i / 180 * Math.PI) * (this.radius + value) + this.center.x,
        Math.sin(i / 180 * Math.PI) * (this.radius + value) + this.center.y
      );
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
}