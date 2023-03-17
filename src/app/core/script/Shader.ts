
export class Shader {
    public shaderProgram!: WebGLProgram | null;
    public positionBuffer!: WebGLBuffer | null;
    public colorBuffer!: WebGLBuffer | null;
    constructor(private gl: WebGLRenderingContext, private vs: string, private fs: string,
            private positions: Float32Array, private colors: Float32Array
        ) {
        this.shaderProgram = this.initShaderProgram(gl, vs, fs);
        this.positionBuffer = this.initPositionBuffer(gl, positions);
        this.colorBuffer = this.initColorBuffer(gl, colors);
    }

    private initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if(vertexShader && fragmentShader) {
            const shaderProgram = gl.createProgram();
            if(shaderProgram) {
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
                if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                    alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
                    return null;
                }
                else 
                    return shaderProgram;
            }
            else return null
        }
        else return null;
    }

    private loadShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        if(!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    private initPositionBuffer(gl: WebGLRenderingContext, positions: Float32Array) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        return positionBuffer;
    }   

    private initColorBuffer(gl: WebGLRenderingContext, colors: Float32Array) {
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        return colorBuffer; 
    }
}