import { Renderer } from "src/app/core/script/animation";
import { Drawer } from "src/app/core/script/drawer";
import { Shape } from "./Cylinder";

export class CylinderRenderer extends Renderer {
  constructor(
    private draw: Drawer,
    private readonly stepAngle: number,
    private shape: Shape,
  ) {
    super()
  }

  public render(timeDelta: number): void {
    const angle = timeDelta * this.stepAngle;
    this.draw.rotate([1, 0, 0], angle);
    this.draw.clear()
    this.shape.draw()
  }
  
}