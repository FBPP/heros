import { mat4 } from "gl-matrix";

export interface DrawInfo {
    aspect: number;
    vertexCount: number,
    positionNumComponents: number,
    colorNumComponents: number,
    drawArrayMode: number,
}

export interface ShaderInfo {
    shaderProgram: WebGLProgram;
    vertexPosition: number;
    vertexColor: number;
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;   
    positionBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;
}

export class Draw {
    constructor(
        gl: WebGLRenderingContext,
        drawInfo: DrawInfo,
        shaderInfo: ShaderInfo
    ) {
        this.draw(gl, drawInfo, shaderInfo);
    }

    private draw(gl: WebGLRenderingContext, drawInfo: DrawInfo, shaderInfo: ShaderInfo) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView =  45 * Math.PI / 180;
        const aspect = drawInfo.aspect
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

        this.setAttribute(gl, shaderInfo.positionBuffer, shaderInfo.vertexPosition, drawInfo.positionNumComponents, gl.FLOAT, false, 0, 0);
        this.setAttribute(gl, shaderInfo.colorBuffer, shaderInfo.vertexColor, drawInfo.colorNumComponents, gl.FLOAT, false, 0, 0);

       
        gl.useProgram(shaderInfo.shaderProgram);
        gl.uniformMatrix4fv(
            shaderInfo.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            shaderInfo.modelViewMatrix,
            false,
            modelViewMatrix
        );

        gl.drawArrays(drawInfo.drawArrayMode, 0, drawInfo.vertexCount);
    }

    private setAttribute(gl: WebGLRenderingContext, buffer: WebGLBuffer, vertexAttribute: number, numComponents: number, 
            type: number, normalize: boolean, stride: number, offset: number,
        ) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(
                vertexAttribute,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );

            gl.enableVertexAttribArray(vertexAttribute);
        }
}