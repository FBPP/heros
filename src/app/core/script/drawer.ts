import { ReadonlyVec3 } from "gl-matrix";
import { mat4 } from "gl-matrix";


export interface ProjectionInfo {
    aspect: number;
    zNear: number;
    zFar: number;
    fov: number
}

export interface ShaderInfo {
    shaderProgram: WebGLProgram;
    projectionLocation: WebGLUniformLocation;
    modelViewLocation: WebGLUniformLocation; 
}

export interface VertexInfo {
    vertexAttribute: number;
    size: number;
    type: number;
    normalize: boolean;
    stride: number;
    offset: number
}

export class Drawer {
    private modelMatrix!: mat4
    constructor(
        public gl: WebGLRenderingContext,
        private projectionInfo: ProjectionInfo,
        private shaderInfo: ShaderInfo,
        private origin: ReadonlyVec3
    ) {
        this.init();
        this.clear();
        this.mvpTransform();
    }

    private init() {
        this.gl.useProgram(this.shaderInfo.shaderProgram);
    }

    public clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT |  this.gl.DEPTH_BUFFER_BIT);
    }

    public translate(xyz: ReadonlyVec3) {
        mat4.translate(this.modelMatrix, this.modelMatrix, xyz);
        this.bindModelMatrix();
    } 

    public rotate(xyz: ReadonlyVec3, angle: number) {
        mat4.rotate(this.modelMatrix, this.modelMatrix, angle, xyz);
        this.bindModelMatrix();
    }
    
    private bindModelMatrix() {
        this.gl.uniformMatrix4fv(this.shaderInfo.modelViewLocation, false, this.modelMatrix)
    }

    private modelTransform() {
        this.modelMatrix = mat4.create();
        this.translate(this.origin);
    }

    private projectionTransform() {
        const fieldOfView = this.projectionInfo.fov * Math.PI / 180;
        const aspect = this.projectionInfo.aspect
        const zNear = this.projectionInfo.zNear;
        const zFar = this.projectionInfo.zFar;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        this.gl.uniformMatrix4fv(this.shaderInfo.projectionLocation, false, projectionMatrix)
    }

    private mvpTransform() {
        this.modelTransform();
        this.projectionTransform();
    }

    public vertexAttribPointer(attributeInfo: VertexInfo) {
        this.gl.vertexAttribPointer(
            attributeInfo.vertexAttribute,
            attributeInfo.size,
            attributeInfo.type,
            attributeInfo.normalize,
            attributeInfo.stride,
            attributeInfo.offset
        );

        this.gl.enableVertexAttribArray(attributeInfo.vertexAttribute);
    }

    public drawArrays(drawArrayMode: number, vertexCount: number) {
        this.gl.drawArrays(drawArrayMode, 0, vertexCount);
    }

    public drawElements(drawElementMode: number, vertexCount: number, type: number, offset: number) {
        this.gl.drawElements(drawElementMode, vertexCount, type, offset);
    }
}