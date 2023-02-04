import { getColor } from "./handlers.js";
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

    obj.vertices.forEach((vertex) => {
        let point = getPoint(vertex.position[0], vertex.position[1]);
        drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    })
}

export const renderAllObjects = () => {
    // render semua object
    objects.forEach((object) => {renderObject(object)});
}


export const render = (type) => {
    // pass type nya antara LINE, SQUARE, RECT, ato POLY
    if (type == "LINE") {
        let color = getColor();
        let rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0]
        // bikin object baru
        let obj = new Line();
        obj.color = rgbColor;

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

const dragObject = (canvas, event, selectedObject, idx) => {
    let coords = getCoords(canvas, event);
    let x = coords["x"];
    let y = coords["y"];

    if (selectedObject.type != "square"){
        selectedObject.vertices[idx].position[0] = x;
        selectedObject.vertices[idx].position[1] = y;
    }

    renderAllObjects();
}

const getObject = (gl_canvas, event) => {
    let selectedObject = null;
    let vertexIndex = -1;
    
    let coords = getCoords(gl_canvas, event);
    let x = coords["x"];
    let y = coords["y"];
    console.log(objects)
    for (const obj of objects) {
        let index = obj.checkCoords(x, y);

        if (index == -1){
            continue;
        }

        selectedObject = obj;
        vertexIndex = index;
        break;
    }

    if (selectedObject == null){
        console.log("no object selected");
        return null;
    }

    return {
        selected: selectedObject,
        vertexIndex: vertexIndex
    }
}

// untuk dragging
gl_canvas.addEventListener("mousedown", (event) => {
    let object = getObject(gl_canvas, event);

    if (object) {
        let selectedObject = object["selected"]
        let vertexIndex = object["vertexIndex"]

        function drag(event) {
            dragObject(gl_canvas, event, selectedObject, vertexIndex);
        }

        gl_canvas.addEventListener('mousemove', drag);
        gl_canvas.addEventListener("mouseup", function end() {
            gl_canvas.removeEventListener("mousemove", drag);
            gl_canvas.removeEventListener("mouseup", end);
        });
    }
})

gl_canvas.addEventListener("click", (event) => {
    let object = getObject(gl_canvas, event);
    
    if (object){
        let selectedObject = object["selected"]
        let vertexIndex = object["vertexIndex"]
    
        let point = getPoint(
            selectedObject.vertices[vertexIndex].position[0], 
            selectedObject.vertices[vertexIndex].position[1],
        true);
    
        renderAllObjects();
        drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    
        let colorPicker = document.getElementById("color-picker");
    
        colorPicker.addEventListener("change", function update() {
            console.log("hehe")
    
            let color = getColor();
            let rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0]
            console.log(rgbColor);
            selectedObject.vertices[vertexIndex].color = rgbColor;
            console.log(selectedObject.vertices[vertexIndex].color);
    
            renderAllObjects();

            colorPicker.removeEventListener("change", update);
        })
    }
})

