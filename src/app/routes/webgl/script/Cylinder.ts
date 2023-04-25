import { Shader } from "src/app/core/script/Shader";
import { Drawer } from "src/app/core/script/drawer";

export abstract class Shape {
  protected positionBuffer: WebGLBuffer | null = null;
  protected colorBuffer: WebGLBuffer | null = null;
  protected pointer: number[] = [];
  protected pointerBuffer: WebGLBuffer | null = null;

  constructor(
    protected shader: Shader,
    protected drawer: Drawer,
    protected vertexPositionLocation: number | null = null,
    protected vertexColorLocation: number | null = null
  ) {
    this.createBuffer();
    this.bindBuffer();
    this.draw();
  }
  protected abstract createBuffer(): void;
  protected abstract bindBuffer(): void;
  public abstract draw(): void;
}

export class Cylinder extends Shape {
    constructor(
      shader: Shader,
      drawer: Drawer,
      vertexPositionLocation: number | null = null,
      vertexColorLocation: number | null = null
    ) {
      super(shader, drawer, vertexPositionLocation, vertexColorLocation)
      
    }

    protected createBuffer() {
      const top = [0, 1, 0];
      const bottom = [0, -1, 0];
      const resolution = 50;
      const theta = 2 * Math.PI / resolution;
      const vertexs: number[] = [];
      const radiusB = 1;
      const radiusT = 1;
      const color: number[] = [];
      for(let index = 0; index < resolution; ++index) {
        const x = Math.cos(theta * index) * radiusT;
        const z = Math.sin(theta * index) * radiusT;
  
        const x1 = Math.cos(theta * index) * radiusB;
        const z1 = Math.sin(theta * index) * radiusB;
        vertexs.push(x, top[1], z, x1, bottom[1], z1);
        for(let i = 0; i < 2; ++i) {
          color.push(0.0, 0.5, 0.5, 1.0);
        }
      }
      for(let index = 0; index < resolution; ++index) {
        const x = Math.cos(theta * index) * radiusT;
        const z = Math.sin(theta * index) * radiusT;
        
        const x1 = Math.cos(theta * index) * radiusB;
        const z1 = Math.sin(theta * index) * radiusB;
        vertexs.push(x, top[1], z, x1, bottom[1], z1);
        color.push(0.0, 0.0, 1.0, 1.0);
        color.push(1.0, 0.0, 0.0, 1.0);
      }
      vertexs.push(...top, ...bottom);
      color.push(0.0, 0.0, 1.0, 1.0);
      color.push(1.0, 0.0, 0.0, 1.0);

      // 斜面
      for(let i = 0; i < resolution * 2; ++i) {
        this.pointer.push(i);
        this.pointer.push((i + 1) % (resolution * 2));
        this.pointer.push((i + 2) % (resolution * 2));

      }
  
      // 底面
      for(let i = 0; i < resolution; ++i) {
        this.pointer.push((2 * i + 1)  % (resolution * 2) + resolution * 2);
        this.pointer.push(resolution * 4 + 1);
        this.pointer.push((2 * (i + 1) + 1) % (resolution * 2) + resolution * 2);
      }
  
      // 顶面
      for(let i = 0; i < resolution; ++i) {
        this.pointer.push((2 * i) % (resolution * 2) + resolution * 2);
        this.pointer.push(resolution * 4);
        this.pointer.push((2 * (i + 1)) % (resolution * 2) + resolution * 2);
      }
  
      this.positionBuffer = this.shader.createBuffer(new Float32Array(vertexs));
      this.colorBuffer = this.shader.createBuffer(new Float32Array(color));
      this.pointerBuffer = this.shader.createElementBuffer(new Uint16Array(this.pointer));
    }

    protected bindBuffer() {
      console.log(this.vertexPositionLocation)
      if(this.shader.gl && this.positionBuffer && this.colorBuffer &&  this.vertexPositionLocation !== null && this.vertexColorLocation != null) {
       
        this.shader.gl.bindBuffer(this.shader.gl.ARRAY_BUFFER, this.positionBuffer);
        this.drawer.vertexAttribPointer({
          vertexAttribute: this.vertexPositionLocation,
          size: 3,
          type: this.shader.gl.FLOAT,
          normalize: false,
          stride: 0,
          offset: 0
        });                
  
        this.shader.gl.bindBuffer(this.shader.gl.ARRAY_BUFFER, this.colorBuffer);
        this.drawer.vertexAttribPointer({
          vertexAttribute: this.vertexColorLocation,
          size: 4,
          type: this.shader.gl.FLOAT,
          normalize: false,
          stride: 0,
          offset: 0
        });
  
        this.shader.gl.bindBuffer(this.shader.gl.ELEMENT_ARRAY_BUFFER, this.pointerBuffer);
      }
    }

    public draw(): void {
      this.shader.gl.bindBuffer(this.shader.gl.ELEMENT_ARRAY_BUFFER, this.pointerBuffer);
      this.drawer.drawElements(this.shader.gl.TRIANGLES, this.pointer.length, this.shader.gl.UNSIGNED_SHORT, 0);
    }
}