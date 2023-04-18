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

  private vertexCount = 11;
  constructor() { 

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initShader();    
  }
  private createStar() {
    const radius = 0.7;
    const minRadius = 0.25;
    const radiation = 360 / 10 * Math.PI / 180;
    const radiationRotate = 360 / 10 / 2 * Math.PI / 180;
    const origin = {x: -1, y: 1}
    let vertexs: number[] =  [];
    let colors: number[] = [];
    for(let index = 0; index < this.vertexCount; ++index) {
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
        colors.push(1.0 / this.vertexCount * (index + 1));
        colors.push(0);
        colors.push(0);
        colors.push(1.0);
    }
    return {
        vertexs,
        colors
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


  }

  private initShader() {
    const  canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gl = canvas.getContext("webgl");
    if(gl) {
        const { vertexs, colors } = this.createStar();
        const shader = new Shader(gl, this.vsSource, this.fsSource);
        if(shader.shaderProgram) {
            const vertexPosition = gl.getAttribLocation(shader.shaderProgram, "aVertexPosition");
            const vertexColor = gl.getAttribLocation(shader.shaderProgram, "aVertexColor")
            const projectionLocation = gl.getUniformLocation(shader.shaderProgram, "uProjectionMatrix");
            const modelViewLocation = gl.getUniformLocation(shader.shaderProgram, "uModelViewMatrix");
            const positionBuffer = shader.createBuffer(new Float32Array(vertexs));
            const colorBuffer = shader.createBuffer(new Float32Array(colors));
            if(vertexPosition != null && vertexColor != null && projectionLocation && modelViewLocation && positionBuffer && colorBuffer) {
                const shaderInfo: ShaderInfo = {
                    shaderProgram: shader.shaderProgram,
                    projectionLocation, 
                    modelViewLocation,
                }

                const mvpInfo: MVPInfo = {
                  aspect: canvas.width / canvas.height,
                  fov: 45,
                  zNear: 0.1,
                  zFar: 100
                };

                const draw = new Draw(gl, mvpInfo, shaderInfo);
                draw.bindBuffer({
                  buffer: positionBuffer,
                  vertexAttribute: vertexPosition,
                  size: 2,
                  type: gl.FLOAT,
                  normalize: false,
                  stride: 0,
                  offset: 0
                });                

                draw.bindBuffer({
                  buffer: colorBuffer,
                  vertexAttribute: vertexColor,
                  size: 4,
                  type: gl.FLOAT,
                  normalize: false,
                  stride: 0,
                  offset: 0
                });
                draw.drawArrays(gl.TRIANGLE_FAN, this.vertexCount);
            }
        }
     
    }
 
  }


}
