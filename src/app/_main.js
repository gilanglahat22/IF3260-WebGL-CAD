import { Line } from "./line.js";
import { getCoords } from "./utils/coords.js";
import { drawObj } from "./utils/draw_utils.js";
import { initShaders } from "./utils/shaders.js";

let vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;

    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`

let fragmentShaderSource = `
    precision mediump float;

    varying lowp vec4 vColor;

    void main(){
        gl_FragColor = vColor;
    }
`

let type = "LINE";
let objects = [];

export const loadObject = (obj) => {
    drawObj(gl, programInfo, obj.vertices, obj.color, methodMap[obj.type], obj.points);
}

export const getSquarePoint = (x, y) => {
    return [
        x-0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y-0.025, 1.0, 1.0, 1.0,
        x-0.025, y-0.025, 1.0, 1.0, 1.0
    ]
}


export const renderObject = (obj) => {
    loadObject(obj.vertices, obj.color, obj.type, obj.points);

    for (var i = 0; i < obj.vertices.length; i++){
        let square_point = getSquarePoint(obj.vertices[i], obj.vertices[i + 1]);
        loadObject(square_point, 4, gl.TRIANGLE_FAN)
    }
}

// get canvas dari html
const gl_canvas = document.getElementById("gl-canvas");
const gl = gl_canvas.getContext("webgl");

const methodMap = {
    "line": gl.LINES,
}

if (!!!gl) {
    alert("Unable to start program; is WebGL supported in your browser?");
}

const shaderProgram = initShaders(gl, vertexShaderSource, fragmentShaderSource);

// set warna background canvas
gl.clearColor(0.5, 0.5, 0.5, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

    // inisiasi shader
const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    }
}

const render = (coords) => {

    if (objects.length > 0 && objects[objects.length - 1].completed == false){
        objects[objects.length - 1].draw(coords["x"], coords["y"])
    } else {
        if (type == "LINE") {
            let obj = new Line();
            obj.draw(coords["x"], coords["y"]);
            objects.push(obj);
        }
    }
    console.log(objects);
}

gl_canvas.addEventListener("mousedown", (e) => {
    let coords = getCoords(gl_canvas, e)
    render(coords);
})

