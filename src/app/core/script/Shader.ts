
export class Shader {
    public shaderProgram!: WebGLProgram | null;
    constructor(private gl: WebGLRenderingContext, private vs: string, private fs: string,
        ) {
        this.shaderProgram = this.initShaderProgram(gl, vs, fs);
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

    public createBuffer(data: BufferSource) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        return buffer;
    }

    public createElementBuffer(data: BufferSource) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        return buffer;
    }
}