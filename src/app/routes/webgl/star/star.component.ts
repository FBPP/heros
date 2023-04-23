import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Draw, MVPInfo, ShaderInfo } from 'src/app/core/script/draw';
import { Shader } from 'src/app/core/script/Shader';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit,  AfterViewInit{
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;
  vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
  `;

  fsSource = `
    varying lowp vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }
  `
  private gl: WebGLRenderingContext | null = null;
  private shader: Shader | null = null;
  private draw: Draw | null = null;
  private vertexPositionLocation: number | null = null;
  private vertexColorLocation: number | null = null;

  constructor() { 

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.shader = this.initShader();   
    this.draw = this.initDraw();
    this.drawStar();
    this.drawCylinder()
  }
  private drawStar() {
    if(!this.gl || !this.shader || !this.draw || this.vertexPositionLocation === null || this.vertexColorLocation === null) return;
    const vertexCount = 11;
    const radius = 0.7;
    const minRadius = 0.25;
    const radiation = 360 / 10 * Math.PI / 180;
    const radiationRotate = 360 / 10 / 2 * Math.PI / 180;
    const origin = {x: -1, y: 1}
    let vertexs: number[] =  [];
    let colors: number[] = [];
    for(let index = 0; index < vertexCount; ++index) {
        let x, y;
        if(index % 2 == 0) {
            x = Math.cos(radiation * index - radiationRotate ) * minRadius;
            y = Math.sin(radiation * index - radiationRotate) * minRadius;
        }
        else {
            x = Math.cos(radiation * index - radiationRotate) * radius;
            y = Math.sin(radiation * index - radiationRotate) * radius;
        }
        vertexs.push(x + origin.x), vertexs.push(y + origin.y);
        colors.push(1.0 / vertexCount * (index + 1));
        colors.push(0);
        colors.push(0);
        colors.push(1.0);
    }
    
    const positionBuffer = this.shader.createBuffer(new Float32Array(vertexs));
    const colorBuffer = this.shader.createBuffer(new Float32Array(colors));
    if(positionBuffer && colorBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
      this.draw.vertexAttribPointer({
        vertexAttribute: this.vertexPositionLocation,
        size: 2,
        type: this.gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });                
  
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
      this.draw.vertexAttribPointer({
        vertexAttribute: this.vertexColorLocation,
        size: 4,
        type: this.gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
      this.draw.drawArrays(this.gl.TRIANGLE_FAN, vertexCount);
    }

  }

  private drawCylinder() {
    if(!this.shader || !this.draw) return; 
    const height = 1;
    const top = [0, height, 0];
    const resolution = 50;
    const bottom = [0, -1, 0];
    const theta = 2 * Math.PI / resolution;
    const vertexs: number[] = [];
    const radiusB = 1;
    const radiusT = 1;
    for(let index = 0; index < resolution; ++index) {
      const x = Math.cos(theta * index) * radiusT;
      const z = Math.sin(theta * index) * radiusT;

      const x1 = Math.cos(theta * index) * radiusB;
      const z1 = Math.sin(theta * index) * radiusB;
      vertexs.push(x, height, z, x1, -1, z1);
    }
    vertexs.push(...bottom, ...top);
    const pointer: number[] = [];
    const color: number[] = [];
    // 斜面
    for(let i = 0; i < resolution * 2; ++i) {
      pointer.push(i);
      pointer.push((i + 1) % (resolution * 2));
      pointer.push((i + 2) % (resolution * 2));
      for(let i = 0; i < 2; ++i) {
        color.push(0.0, 1.0, 0.0, 1.0);
      }
    }

    // 底面
    for(let i = 0; i < resolution; ++i) {
      pointer.push((2 * i + 1)  % (resolution * 2));
      pointer.push(resolution * 2);
      pointer.push((2 * (i + 1) + 1) % (resolution * 2));
      for(let i = 0; i < 2; ++i) {
        color.push(0.0, 0.0, 1.0, 1.0);
      }
    }

    // 顶面
    for(let i = 0; i < resolution; ++i) {
      pointer.push((2 * i) % (resolution * 2));
      pointer.push(resolution * 2 + 1);
      pointer.push((2 * (i + 1)) % (resolution * 2));
      for(let i = 0; i < 2; ++i) {
        color.push(1.0, 0.0, 0.0, 1.0);
      }
    }

    const positionBuffer = this.shader.createBuffer(new Float32Array(vertexs));
    const colorBuffer = this.shader.createBuffer(new Float32Array(color));
    const pointerBuffer = this.shader.createElementBuffer(new Uint16Array(pointer));

    if(this.gl && positionBuffer && colorBuffer &&  this.vertexPositionLocation !== null && this.vertexColorLocation != null) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
      this.draw.vertexAttribPointer({
        vertexAttribute: this.vertexPositionLocation,
        size: 3,
        type: this.gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });                

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
      this.draw.vertexAttribPointer({
        vertexAttribute: this.vertexColorLocation,
        size: 4,
        type: this.gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });

      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, pointerBuffer);
      this.draw.drawElements(this.gl.TRIANGLES, pointer.length, this.gl.UNSIGNED_SHORT, 0);
    }
  }

  private initShader() {
    const  canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    this.gl = canvas.getContext("webgl");
    if(this.gl) {
        const shader = new Shader(this.gl, this.vsSource, this.fsSource);
        return shader;
    } 
    else {
      return null;
    }    
  }

  private initDraw() {
    if(!this.shader || !this.gl || !this.shader.shaderProgram) return null;

    this.vertexPositionLocation = this.gl.getAttribLocation(this.shader.shaderProgram, "aVertexPosition");
    this.vertexColorLocation = this.gl.getAttribLocation(this.shader.shaderProgram, "aVertexColor")
    const projectionLocation = this.gl.getUniformLocation(this.shader.shaderProgram, "uProjectionMatrix");
    const modelViewLocation = this.gl.getUniformLocation(this.shader.shaderProgram, "uModelViewMatrix");
    if(projectionLocation && modelViewLocation) {
      const shaderInfo: ShaderInfo = {
        shaderProgram: this.shader.shaderProgram,
        projectionLocation, 
        modelViewLocation,
      }
      const canvas = this.canvasRef.nativeElement
      const mvpInfo: MVPInfo = {
        aspect: canvas.width / canvas.height,
        fov: 45,
        zNear: 0.1,
        zFar: 100
      };
      const draw = new Draw(this.gl, mvpInfo, shaderInfo);
      return draw;
    }
    else return null; 
  }


}
