import { mat4 } from "gl-matrix";


export interface MVPInfo {
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

export interface BufferInfo {
    buffer: WebGLBuffer;
    vertexAttribute: number;
    size: number;
    type: number;
    normalize: boolean;
    stride: number;
    offset: number
}

export class Draw {
    constructor(
        private gl: WebGLRenderingContext,
        mvpInfo: MVPInfo,
        shaderInfo: ShaderInfo
    ) {
        this.init(shaderInfo);
        this.clear();
        this.mvpTransform(mvpInfo, shaderInfo);
    }

    private init(shaderinfo: ShaderInfo) {
        this.gl.useProgram(shaderinfo.shaderProgram);
    }

    private clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT |  this.gl.DEPTH_BUFFER_BIT);
    }

    private mvpTransform(mvpInfo: MVPInfo, shaderInfo: ShaderInfo) {
        const fieldOfView =  mvpInfo.fov * Math.PI / 180;
        const aspect = mvpInfo.aspect
        const zNear = mvpInfo.zNear;
        const zFar = mvpInfo.zFar;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])


        this.gl.uniformMatrix4fv(shaderInfo.projectionLocation, false, projectionMatrix)
        this.gl.uniformMatrix4fv(shaderInfo.modelViewLocation, false, modelViewMatrix);
    }

    public bindBuffer(bufferInfo: BufferInfo) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferInfo.buffer);
        this.gl.vertexAttribPointer(
            bufferInfo.vertexAttribute,
            bufferInfo.size,
            bufferInfo.type,
            bufferInfo.normalize,
            bufferInfo.stride,
            bufferInfo.offset
        );

        this.gl.enableVertexAttribArray(bufferInfo.vertexAttribute);
    }

    public drawArrays(drawArrayMode: number, vertexCount: number) {
        this.gl.drawArrays(drawArrayMode, 0, vertexCount);
    }

}