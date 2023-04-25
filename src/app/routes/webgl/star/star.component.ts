import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Animation, Renderer } from 'src/app/core/script/animation';
import { Drawer, ProjectionInfo, ShaderInfo } from 'src/app/core/script/drawer';
import { Shader } from 'src/app/core/script/Shader';
import { CylinderRenderer } from '../script/CylinderRenderer';
import { Cylinder } from '../script/Cylinder';

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
  private shader: Shader | null = null;
  private drawer: Drawer | null = null;
  private vertexPositionLocation: number | null = null;
  private vertexColorLocation: number | null = null;

  constructor() { 

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.shader = this.initShader();   
    this.initLocation()
    this.initDraw()
    this.drawer = this.initDraw();
    // this.drawStar();
    this.drawCylinder()
  }
  private drawStar() {
    if(!this.shader || !this.drawer || this.vertexPositionLocation === null || this.vertexColorLocation === null) return;
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
      this.shader.gl.bindBuffer(this.shader.gl.ARRAY_BUFFER, positionBuffer);
      this.drawer.vertexAttribPointer({
        vertexAttribute: this.vertexPositionLocation,
        size: 2,
        type: this.shader.gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });                
  
      this.shader.gl.bindBuffer(this.shader.gl.ARRAY_BUFFER, colorBuffer);
      this.drawer.vertexAttribPointer({
        vertexAttribute: this.vertexColorLocation,
        size: 4,
        type: this.shader.gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
      });
      this.drawer.drawArrays(this.shader.gl.TRIANGLE_FAN, vertexCount);
    }
  }

  private drawCylinder() {
    if(!this.shader || !this.drawer) return; 
    const cylinder = new Cylinder(this.shader, this.drawer, this.vertexPositionLocation, this.vertexColorLocation);
    cylinder.draw()
    const animation = new Animation(new CylinderRenderer(this.drawer, Math.PI / 180 / 10, cylinder))
  }

  private initShader() {
    const  canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gl = canvas.getContext("webgl");
    if(gl) {
        const shader = new Shader(gl, this.vsSource, this.fsSource);
        return shader;
    } 
    else {
      return null;
    }    
  }

  private initLocation() {
    if(this.shader && this.shader.shaderProgram)  {
      this.vertexPositionLocation = this.shader.gl.getAttribLocation(this.shader.shaderProgram, "aVertexPosition");
      this.vertexColorLocation = this.shader.gl.getAttribLocation(this.shader.shaderProgram, "aVertexColor")
    }
  }

  private initDraw() {
    if(!this.shader || !this.shader.gl || !this.shader.shaderProgram) return null;

    const projectionLocation = this.shader.gl.getUniformLocation(this.shader.shaderProgram, "uProjectionMatrix");
    const modelViewLocation = this.shader.gl.getUniformLocation(this.shader.shaderProgram, "uModelViewMatrix");
    if(projectionLocation && modelViewLocation) {
      const shaderInfo: ShaderInfo = {
        shaderProgram: this.shader.shaderProgram,
        projectionLocation, 
        modelViewLocation,
      }
      const canvas = this.canvasRef.nativeElement
      const projectionInfo: ProjectionInfo = {
        aspect: canvas.width / canvas.height,
        fov: 45,
        zNear: 0.1,
        zFar: 100
      };
      const drawer = new Drawer(this.shader.gl, projectionInfo, shaderInfo, [0, 0, -10]);
      return drawer;
    }
    else return null; 
  }


}
