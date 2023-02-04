import { getColor } from "./handlers.js";
import { Model } from "./model.js";
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
    "LINE": gl.LINES,
    "POLY": gl.TRIANGLE_FAN
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
    console.log(JSON.stringify(objects));
}


export const render = (type) => {
    // pass type nya antara LINE, SQUARE, RECT, ato POLY
    if (type == "LINE" || type == "POLY") {
        const count = type == "POLY" ? document.getElementById("polygon-vertices").value : 2

        const color = getColor();
        const rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0]
        // bikin object baru
        let obj = new Model();
        obj.color = rgbColor;
        obj.type = type;
        obj.count = count;

        // tambahin event listener
        gl_canvas.addEventListener("click", function lineDraw(e){
            let coords = getCoords(gl_canvas, e)
            obj.draw(coords["x"], coords["y"]);

            if (obj.vertexCount == count){
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

    if (selectedObject.type != "SQUARE"){
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

export const saveFile = () => {
    const fileName = document.getElementById("filename").value;

    if (fileName == ""){
        alert("Please input the output file name!");
        return;
    }

    const content = JSON.stringify(objects);

    const file = new Blob([content], {
        type: "json/javascript"
    })

    const link = document.createElement("a");
    
    link.href = URL.createObjectURL(file);
    link.download = `${fileName}.json`
    link.click();
    URL.revokeObjectURL(link.href);
}

export const loadFile = () => {
    const selectedFile = document.getElementById("load-file").files[0];

    const reader = new FileReader();

    reader.readAsText(selectedFile, "UTF-8");

    reader.onload = (evt) => {
        const temp = JSON.parse(evt.target.result);
        
        let tempObjects = [];

        temp.forEach((item) => {
            let obj = null
            if (item.type == "LINE" || item.type == "POLY") {
                obj = new Model(
                    item.vertices,
                    item.vertexCount,
                    item.type,
                    item.color,
                    item.completed,
                    item.count
                )
            } else {
                alert(`Error in loading file: object type ${item.type} not recognized!`);
            }
            tempObjects.push(obj);
        })

        objects = tempObjects;
        renderAllObjects();

        alert("Successfully loaded file!")
    }
}

