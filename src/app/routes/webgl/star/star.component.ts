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

  constructor() { 

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.shader = this.initShader();   
    this.draw = this.initDraw();
    this.drawStar();
  }
  private drawStar() {
    if(!this.gl || !this.shader || !this.draw) return;
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
      this.draw.bindBuffer({
        buffer: positionBuffer,
        vertexAttribute: vertexPosition,
        size: 2,
        type: this.gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });                
  
      this.draw.bindBuffer({
        buffer: colorBuffer,
        vertexAttribute: vertexColor,
        size: 4,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
      this.draw.drawArrays(gl.TRIANGLE_FAN, this.vertexCount);
    }

  }

  private createCylinder() {
    const height = 20;
    const top = [0, height, 0];
    const resolution = 50;
    const bottom = [0, -1, 0];
    const theta = 360 / resolution * Math.PI / 180;
    const vertexs: number[] = [];
    const radiusB = 5;
    const radiusT = 5;
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
      pointer.push((i + 1) % resolution * 2);
      pointer.push((i + 2) % resolution * 2);
      for(let i = 0; i < 3; ++i) {
        color.push(0.0, 0.0, 1.0, 1.0);
      }
    }

    // 底面
    for(let i = 0; i < resolution; ++i) {
      pointer.push((2 * i + i)  % (resolution * 2));
      pointer.push(resolution * 2);
      pointer.push((2 * (i + 1) + 1) % (resolution * 2));
      for(let i = 0; i < 3; ++i) {
        color.push(0.0, 0.0, 1.0, 1.0);
      }
    }

    // 顶面
    for(let i = 0; i < resolution; ++i) {
      pointer.push((2 * i) % (resolution * 2));
      pointer.push(resolution * 2 + 1);
      pointer.push((2 * (i + 1)) % (resolution * 2));
      for(let i = 0; i < 3; ++i) {
        color.push(0.0, 0.0, 1.0, 1.0);
      }
    }

    return {
      vertexs,
      pointer,
      color,
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

    const vertexPosition = this.gl.getAttribLocation(this.shader.shaderProgram, "aVertexPosition");
    const vertexColor = this.gl.getAttribLocation(this.shader.shaderProgram, "aVertexColor")
    const projectionLocation = this.gl.getUniformLocation(this.shader.shaderProgram, "uProjectionMatrix");
    const modelViewLocation = this.gl.getUniformLocation(this.shader.shaderProgram, "uModelViewMatrix");
    if(vertexPosition && vertexColor && projectionLocation && modelViewLocation) {
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

  private drawStar() {
    
  }

  private drawCylinder() {

  }


}
