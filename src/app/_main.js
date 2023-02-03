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


export const renderObject = (obj) => {
    //load 1 object
    drawObject(gl, programInfo, obj.vertices, methodMap[obj.type], obj.vertexCount);

    for (var i = 0; i < obj.vertices.length; i++){
        let point = getPoint(obj.vertices[i].position[0], obj.vertices[i].position[1]);
        drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    }
}

export const renderAllObjects = () => {
    // render semua object
    for (var i = 0; i < objects.length; i++){
        renderObject(objects[i]);
    }
}


const render = (type) => {
    // pass type nya antara LINE, SQUARE, RECT, ato POLY
    if (type == "LINE") {
        // bikin object baru
        let obj = new Line();

        // tambahin event listener
        gl_canvas.addEventListener("click", function lineDraw(e){
            let coords = getCoords(gl_canvas, e)
            obj.draw(coords["x"], coords["y"]);

            if (obj.vertexCount == 2){
                gl_canvas.removeEventListener("click", lineDraw)
            }
        })

        objects.push(obj);
    }
}

// tambahin onclick di sini
document.getElementById("line-button").onclick = () => {render("LINE")}
document.getElementById("square-button").onclick = () => {render("SQUARE")}