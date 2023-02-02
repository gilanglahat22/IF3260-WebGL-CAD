import { initShaders } from "./shaders.js";

let vertexShaderSource = `
    attribute vec4 a_position;

    void main(){
        gl_Position = a_position;
    }
`

let fragmentShaderSource = `
    precision mediump float;

    void main(){
        gl_FragColor = vec4(1, 1, 1, 1);
    }
`

const main = () => {
    const gl_canvas = document.getElementById("gl-canvas");

    const gl = gl_canvas.getContext("webgl");

    const shaderProgram = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

main();