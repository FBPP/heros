import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Draw, DrawInfo, ShaderInfo } from 'src/app/core/script/draw';
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
        vertexs.push(x), vertexs.push(y);
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

  private initShader() {
    const  canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gl = canvas.getContext("webgl");
    if(gl) {
        const {vertexs, colors}= this.createStar();
        const shader = new Shader(gl, this.vsSource, this.fsSource, 
                new Float32Array(vertexs), new Float32Array(colors));
        if(shader.shaderProgram) {
            const vertexPosition = gl.getAttribLocation(shader.shaderProgram, "aVertexPosition");
            const vertexColor = gl.getAttribLocation(shader.shaderProgram, "aVertexColor")
            const projectionMatrix = gl.getUniformLocation(shader.shaderProgram, "uProjectionMatrix");
            const modelViewMatrix = gl.getUniformLocation(shader.shaderProgram, "uModelViewMatrix");
            if(shader.positionBuffer && vertexPosition != null && vertexColor != null && projectionMatrix && modelViewMatrix && shader.colorBuffer) {
                const drawInfo: DrawInfo = {
                    aspect: canvas.width / canvas.height,
                    vertexCount: this.vertexCount,
                    positionNumComponents: 2,
                    colorNumComponents: 4,
                    drawArrayMode: gl.TRIANGLE_FAN
                };
                const shaderInfo: ShaderInfo = {
                    shaderProgram: shader.shaderProgram,
                    vertexPosition: vertexPosition, 
                    vertexColor: vertexColor,
                    projectionMatrix: projectionMatrix, 
                    modelViewMatrix: modelViewMatrix,
                    positionBuffer: shader.positionBuffer,
                    colorBuffer: shader.colorBuffer
                }
                const draw = new Draw(gl, drawInfo, shaderInfo);
            }
        }
     
    }
 
  }


}
