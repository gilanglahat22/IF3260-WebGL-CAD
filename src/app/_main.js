import { Line } from "./line.js";
import { getCoords, getSquarePoint } from "./utils/coords.js";
import { drawObject } from "./utils/draw_utils.js";
import { initShaders } from "./utils/shaders.js";

let vertexShaderSource = `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec3 aVertexColor;

    varying vec3 vColor;

    void main(){
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
        vColor = aVertexColor;
    }
`

let fragmentShaderSource = `
    precision mediump float;

    varying vec3 vColor;

    void main(){
        gl_FragColor = vec4(vColor, 1.0);
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
    console.log(objects);
})


export const loadObject = (obj) => {
    drawObject(gl, programInfo, obj.vertices, obj.color, methodMap[obj.type], obj.vertexCount);
}


// export const renderObject = (obj) => {
//     loadObject(obj);

//     for (var i = 0; i < obj.vertices.length; i += 2){
//         let square_point = getSquarePoint(obj.vertices[i], obj.vertices[i + 1]);
//         drawObject(gl, programInfo, square_point, [1.0, 1.0, 1.0], gl.TRIANGLE_FAN, 4);
//     }
// }

export const renderAllObjects = () => {
    for (var i = 0; i < objects.length; i++){
        loadObject(objects[i]);
        // for (var j = 0; j < objects[i].length; j++){
        //     drawObject(gl, programInfo, objects[i].vertices[j], objects[i].color, gl.TRIANGLE_FAN, 4);
        // }
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