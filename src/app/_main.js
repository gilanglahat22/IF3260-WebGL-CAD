import { Line } from "./line.js";
import { getCoords, getPoint } from "./utils/coords.js";
import { drawObject } from "./utils/draw_utils.js";
import { initShaders } from "./utils/shaders.js";

let vertexShaderSource = `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec4 aVertexColor;

    varying lowp vec4 vColor;

    void main(){
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
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


// get canvas dari html
const gl_canvas = document.getElementById("gl-canvas");
const gl = gl_canvas.getContext("webgl");

if (!!!gl) {
    alert("Unable to start program; is WebGL supported in your browser?");
}

const methodMap = {
    "line": gl.LINES,
}


const shaderProgram = initShaders(gl, vertexShaderSource, fragmentShaderSource);

const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    }
}

gl_canvas.addEventListener("mousedown", (e) => {
    let coords = getCoords(gl_canvas, e)
    render(coords);
})

export const loadObject = (obj) => {
    drawObject(gl, programInfo, obj.vertices, methodMap[obj.type], obj.vertexCount);

    for (var i = 0; i < obj.vertices.length; i++){
        let point = getPoint(obj.vertices[i].position[0], obj.vertices[i].position[1]);
        drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    }
}

export const renderAllObjects = () => {
    for (var i = 0; i < objects.length; i++){
        loadObject(objects[i]);
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
}