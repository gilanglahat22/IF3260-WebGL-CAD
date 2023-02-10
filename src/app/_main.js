import { disableAllButtons, enableAllButtons, getColor } from "./handlers.js";
import { Rectangle } from "./rectangle.js";
import { Square } from "./square.js";
import { Model } from "./model.js";
import { getCoords, getPoint } from "./utils/coords.js";
import { drawObject } from "./utils/draw_utils.js";
import { initShaders } from "./utils/shaders.js";
import { ConvexHull } from "./utils/convex/process.js";
import { gjk } from "./utils/GJK_Algorithm/gjk.js";

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

gl.canvas.width = 0.8 * window.innerWidth
gl.canvas.height = 0.8 * window.innerWidth

if (!!!gl) {
    alert("Unable to start program; is WebGL supported in your browser?");
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
    const method = obj.vertexCount == 2 ? gl.LINES : gl.TRIANGLE_FAN;
    // console.log(obj.vertices);
    drawObject(gl, programInfo, obj.vertices, method, obj.vertexCount);

    obj.vertices.forEach((vertex) => {
        let point = getPoint(vertex.position[0], vertex.position[1]);
        drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    })
}

export const renderAllObjects = () => {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    // render semua object
    objects.forEach((object) => {renderObject(object)});
}


export const render = (type) => {
    // pass type nya antara LINE, SQUARE, R"ECT, ato POLY

    let count;
    let obj;
    if(type == "LINE"){
        count = 2;
        obj = new Model();
    }else if(type == 'POLY'){
        count = document.getElementById("polygon-vertices").value;
        obj = new Model();
    }else if(type == 'RECT'){
        count = 2;
        obj = new Rectangle();
    }else if(type == 'SQUARE'){
        count = 1;
        obj = new Square();
    }
    const color = getColor();
    const rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0]
    // bikin object baru
    obj.color = rgbColor;
    obj.type = type;
    obj.count = count;


    function drag(event) {
        let coords = getCoords(gl_canvas, event)

        const newVertex = {
            position: [coords["x"], coords["y"]],
            color: rgbColor
        }
        const method = obj.vertexCount == 1 ? gl.LINES : gl.TRIANGLE_FAN;

        let newVertices = JSON.parse(JSON.stringify(obj.vertices));
        newVertices.push(newVertex);
        newVertices = ConvexHull(newVertices)

        renderAllObjects()

        drawObject(gl, programInfo, newVertices, method, newVertices.length);

        newVertices.forEach((vertex) => {
            let point = getPoint(vertex.position[0], vertex.position[1], true);
            drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
        })
    }



    disableAllButtons();
    // tambahin event listener
    gl_canvas.addEventListener("click", function lineDraw(e){
        if (obj.type == "LINE" || obj.type == "POLY"){
            gl_canvas.addEventListener("mousemove", drag)
        }

        let coords = getCoords(gl_canvas, e)
        obj.draw(coords["x"], coords["y"]);

        if (obj.vertexCount == count){
            gl_canvas.removeEventListener("click", lineDraw)
            gl_canvas.removeEventListener("mousemove", drag)
        }
    })

    objects.push(obj);
}

const dragVertex = (canvas, event, selectedObject, idx) => {
    let coords = getCoords(canvas, event);
    let x = coords["x"];
    let y = coords["y"];

    selectedObject.resize(idx,x,y);

    renderAllObjects();
}

const getObject = (gl_canvas, event) => {
    let selectedObject = null;
    let vertexIndex = -1;
    
    let coords = getCoords(gl_canvas, event);
    let x = coords["x"];
    let y = coords["y"];

    for (const obj of objects) {
        let index = obj.checkVertex(x, y);

        if (index == -1){
            continue;
        }

        selectedObject = obj;
        vertexIndex = index;
        break;
    }

    if (selectedObject == null){
        // console.log("no object selected");
        renderAllObjects();
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
            dragVertex(gl_canvas, event, selectedObject, vertexIndex);
        }

        if (type != "POLY"){
            gl_canvas.addEventListener('mousemove', drag);
            gl_canvas.addEventListener("mouseup", function end() {
                gl_canvas.removeEventListener("mousemove", drag);
                gl_canvas.removeEventListener("mouseup", end);
            });
        }
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
    
        colorPicker.addEventListener("change", function updateColor() {
    
            let color = getColor();
            let rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0]

            selectedObject.vertices[vertexIndex].color = rgbColor;

            renderAllObjects();

            colorPicker.removeEventListener("change", updateColor);
        })
    }
})

const selectObject = (x, y) => {
    let selectedObject = null;
    let selectedObjects = [];
    for (let i = objects.length - 1; i >= 0; i--){
        if (objects[i].isClicked(x, y)){
            selectedObject = objects[i];
            getObjectNempel(selectedObject);
            break;
        }
    }

    if (selectedObject == null){
        return;
    }

    renderAllObjects();

    selectedObject.vertices.forEach((vertex) => {
        let point = getPoint(vertex.position[0], vertex.position[1], true);
        drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    })

    function getObjectNempel(ObjectSelected){
        for(let i = 0; i<objects.length; i++){
            if(objects[i]!=ObjectSelected){
                let tmpObject = objects[i];
                if(gjk(ObjectSelected,tmpObject)){
                    selectedObjects.push(tmpObject);
                }
            }
        }
    }

    function deleteVertex(event){
        event.preventDefault();
        let coords = getCoords(gl_canvas, event);
        let x = coords["x"];
        let y = coords["y"];
    
        let index = selectedObject.checkVertex(x, y);
    
        if (index == -1){
            gl_canvas.removeEventListener("contextmenu", deleteVertex);
            return;
        }
    
        selectedObject.vertices.splice(index, 1);
        selectedObject.vertexCount--;
        selectedObject.count--;

        gl_canvas.removeEventListener("contextmenu", deleteVertex);
        
        renderAllObjects();
    }

    let colorPicker = document.getElementById("color-picker");
    
    colorPicker.addEventListener("change", function updateAll() {
        let color = getColor();
        let rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0]

        selectedObject.vertices.forEach((vertex) => {
            vertex.color = rgbColor;
        })


        renderAllObjects();

        colorPicker.removeEventListener("change", updateAll);
    })

    function addVertex(event){
        let coords = getCoords(gl_canvas, event);
        let x = coords["x"];
        let y = coords["y"];
        let object = getObject(gl_canvas, event);

        if (object != null || selectedObject.isClicked(x, y)){
            gl_canvas.removeEventListener("click", addVertex);
            return;
        }

        const newVertex = {
            position: [x, y],
            color: selectedObject.color
        }

        selectedObject.vertices.push(newVertex);
        selectedObject.vertices = ConvexHull(selectedObject.vertices)
        selectedObject.vertexCount = selectedObject.vertices.length;
        selectedObject.count = selectedObject.vertices.length;;
        gl_canvas.removeEventListener("click", addVertex);
        
        renderAllObjects();
    }

    function rotateObject(){
        var angle = document.getElementById("rotate").value;
        for(let i = 0; i<selectedObjects.length; i++){
            selectedObjects[i].rotate(angle);
        }
        selectedObject.rotate(angle);
        renderAllObjects();
    }
    document.getElementById("range-slider").style.visibility = "visible"
    let rotateSlider = document.getElementById("rotate");
    rotateSlider.addEventListener("input", rotateObject);

    function remove(event) {
        let coords = getCoords(gl_canvas, event);
        let x = coords["x"];
        let y = coords["y"];

        const obj = getObject(gl_canvas, event);

        if (!!!obj&& !selectedObject.isClicked(x, y)){
            gl_canvas.removeEventListener("contextmenu", deleteVertex);
            gl_canvas.removeEventListener("click", addVertex);
            gl_canvas.removeEventListener("click", remove);
            gl_canvas.removeEventListener("contextmenu", remove);
            rotateSlider.removeEventListener("input", rotateObject);
            document.getElementById("range-slider").style.visibility = "hidden"
            renderAllObjects();
        }
    }


    gl_canvas.addEventListener("mousedown", function select(event) {
        let coords = getCoords(gl_canvas, event);
        let x = coords["x"];
        let y = coords["y"];
        let copy = JSON.parse(JSON.stringify(selectedObject.vertices));

        function drag(e) {
            let newCoords = getCoords(gl_canvas, e);
            let newX = newCoords["x"];
            let newY = newCoords["y"];

            for (let i = 0; i < copy.length; i++){
                selectedObject.vertices[i].position[0] = copy[i].position[0] + (newX - x);
                selectedObject.vertices[i].position[1] = copy[i].position[1] + (newY - y);
            }

            renderAllObjects()

            selectedObject.vertices.forEach((vertex) => {
                let point = getPoint(vertex.position[0], vertex.position[1], true);
                drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
            })
        }
        gl_canvas.addEventListener('mousemove', drag);
        gl_canvas.addEventListener("mouseup", function end() {
            gl_canvas.removeEventListener("mousemove", drag);
            gl_canvas.removeEventListener("mouseup", end);
            gl_canvas.removeEventListener("mousedown", select);
        });
    })



    if (selectedObject.type == "POLY"){
        gl_canvas.addEventListener("contextmenu", deleteVertex);
        gl_canvas.addEventListener("click", addVertex);
    }

    gl_canvas.addEventListener("contextmenu", remove);
    gl_canvas.addEventListener("click", remove);
}

gl_canvas.addEventListener("dblclick", function select(event){    
    let coords = getCoords(gl_canvas, event);
    selectObject(coords["x"], coords["y"]);
})


export const clearCanvas = () => {
    objects = [];
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    enableAllButtons();
}

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

