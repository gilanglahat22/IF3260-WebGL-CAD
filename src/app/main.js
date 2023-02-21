const vertexShaderSource = `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec4 aVertexColor;

    varying lowp vec4 vColor;

    void main(){
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
        vColor = aVertexColor;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    varying lowp vec4 vColor;

    void main(){
        gl_FragColor = vColor;
    }
`;

let objects = [];
let selectedObjectTemp = [];

// get canvas dari html
const gl_canvas = document.getElementById("gl-canvas");
const gl = gl_canvas.getContext("webgl");

gl.canvas.width = 0.9 * window.innerWidth;
gl.canvas.height = 0.9 * window.innerWidth;

if (!!!gl) {
  alert("Unable to start program; is WebGL supported in your browser?");
}

const shaderProgram = initShaders(gl, vertexShaderSource, fragmentShaderSource);

const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
  },
};

const renderObject = (obj) => {
  //load 1 object
  const method = obj.vertexCount == 2 ? gl.LINES : gl.TRIANGLE_FAN;

  drawObject(gl, programInfo, obj.vertices, method, obj.vertexCount);

  obj.vertices.forEach((vertex) => {
    const point = getPoint(vertex.position[0], vertex.position[1]);
    drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
  });
};

const renderAllObjects = () => {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  // render semua object
  objects.forEach((object) => {
    renderObject(object);
  });
};

const render = (type) => {
  // pass type nya antara LINE, SQUARE, R"ECT, ato POLY

  let count;
  let obj;
  if (type == "LINE") {
    count = 2;
    obj = new Model();
  } else if (type == "POLY") {
    count = document.getElementById("polygon-vertices").value;
    obj = new Model();
  } else if (type == "RECT") {
    count = 2;
    obj = new Rectangle();
  } else if (type == "SQUARE") {
    count = 1;
    obj = new Square();
  }
  const color = getColor();
  const rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0];
  // bikin object baru
  obj.color = rgbColor;
  obj.type = type;
  obj.count = count;

  function drag(event) {
    let coords = getCoords(gl_canvas, event);

    const newVertex = {
      position: [coords["x"], coords["y"]],
      color: rgbColor,
    };
    const method = obj.vertexCount == 1 ? gl.LINES : gl.TRIANGLE_FAN;

    let newVertices = JSON.parse(JSON.stringify(obj.vertices));
    newVertices.push(newVertex);
    newVertices = ConvexHull(newVertices);

    renderAllObjects();

    drawObject(gl, programInfo, newVertices, method, newVertices.length);

    newVertices.forEach((vertex) => {
      let point = getPoint(vertex.position[0], vertex.position[1], true);
      drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    });
  }

  function dragRectangle(event) {
    let coords = getCoords(gl_canvas, event);

    const newVertex = {
      position: [coords["x"], coords["y"]],
      color: rgbColor,
    };

    const newHorizontalVertex = {
      position: [coords["x"], obj.vertices[0].position[1]],
      color: rgbColor,
    };

    const newVerticalVertex = {
      position: [obj.vertices[0].position[0], coords["y"]],
      color: rgbColor,
    };

    let newVertices = JSON.parse(JSON.stringify(obj.vertices));
    newVertices.push(newVertex);
    newVertices.push(newHorizontalVertex);
    newVertices.push(newVerticalVertex);
    newVertices = ConvexHull(newVertices);

    renderAllObjects();

    drawObject(
      gl,
      programInfo,
      newVertices,
      gl.TRIANGLE_FAN,
      newVertices.length
    );

    newVertices.forEach((vertex) => {
      let point = getPoint(vertex.position[0], vertex.position[1], true);
      drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
    });
  }

  disableAllButtons();
  // tambahin event listener
  gl_canvas.addEventListener("click", function lineDraw(e) {
    if (obj.type == "LINE" || obj.type == "POLY") {
      gl_canvas.addEventListener("mousemove", drag);
    } else if (obj.type == "RECT") {
      gl_canvas.addEventListener("mousemove", dragRectangle);
    }

    let coords = getCoords(gl_canvas, e);
    obj.draw(coords["x"], coords["y"]);

    if (obj.completed) {
      gl_canvas.removeEventListener("click", lineDraw);
      gl_canvas.removeEventListener("mousemove", drag);
      gl_canvas.removeEventListener("mousemove", dragRectangle);
    }
  });

  objects.push(obj);
};

const dragVertex = (canvas, event, selectedObject, idx) => {
  let coords = getCoords(canvas, event);
  let x = coords["x"];
  let y = coords["y"];

  selectedObject.resize(idx, x, y);

  renderAllObjects();
};

const getObject = (gl_canvas, event) => {
  let selectedObject = null;
  let vertexIndex = -1;

  let coords = getCoords(gl_canvas, event);
  let x = coords["x"];
  let y = coords["y"];

  for (const obj of objects) {
    let index = obj.checkVertex(x, y);

    if (index == -1) {
      continue;
    }

    selectedObject = obj;
    vertexIndex = index;
    break;
  }

  if (selectedObject == null) {
    renderAllObjects();
    return null;
  }

  return {
    selected: selectedObject,
    vertexIndex: vertexIndex,
  };
};

// untuk dragging
gl_canvas.addEventListener("mousedown", (event) => {
  let object = getObject(gl_canvas, event);

  if (object) {
    let selectedObject = object["selected"];
    let vertexIndex = object["vertexIndex"];

    function drag(event) {
      dragVertex(gl_canvas, event, selectedObject, vertexIndex);
      if (selectedObject.type == "POLY") {
        selectedObject.vertices = ConvexHull(selectedObject.vertices);
      }
    }

    gl_canvas.addEventListener("mousemove", drag);
    gl_canvas.addEventListener("mouseup", function end() {
      gl_canvas.removeEventListener("mousemove", drag);
      gl_canvas.removeEventListener("mouseup", end);
    });
  }
});

gl_canvas.addEventListener("click", (event) => {
  let object = getObject(gl_canvas, event);

  if (object) {
    let selectedObject = object["selected"];
    let vertexIndex = object["vertexIndex"];
    let vertex = selectedObject.vertices.find(
      (vertex) => vertex.id == vertexIndex
    );

    let point = getPoint(vertex.position[0], vertex.position[1], true);

    renderAllObjects();
    drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);

    let colorPicker = document.getElementById("color-picker");

    colorPicker.addEventListener("change", function updateColor() {
      let color = getColor();
      let rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0];

      selectedObject.vertices[vertexIndex].color = rgbColor;
      selectedObject.color = rgbColor;

      renderAllObjects();

      colorPicker.removeEventListener("change", updateColor);
    });
  }
});

const selectObject = (x, y, unionSelect = false) => {
  let selectedObject = null;
  selectedObjectTemp = [];

  for (let i = objects.length - 1; i >= 0; i--) {
    if (objects[i].isClicked(x, y)) {
      selectedObject = objects[i];
      selectedObjectTemp.push(selectedObject);
      if (unionSelect) {
        getObjectNempel(selectedObject);
      }
      break;
    }
  }

  if (selectedObject == null) {
    return;
  }

  renderAllObjects();

  let saveModelButton = document.getElementById("save-model");
  saveModelButton.disabled = false;

  saveModelButton.addEventListener("click", function save(){
    saveFile(selectedObject);
    saveModelButton.removeEventListener("click", save);
  })

  selectedObject.vertices.forEach((vertex) => {
    let point = getPoint(vertex.position[0], vertex.position[1], true);
    drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
  });

  function getObjectNempel(ObjectSelected) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i] != ObjectSelected) {
        let tmpObject = objects[i];
        if (gjk(ObjectSelected, tmpObject)) {
          selectedObjectTemp.push(tmpObject);
        }
      }
    }
  }

  function deleteVertex(event) {
    event.preventDefault();
    let coords = getCoords(gl_canvas, event);
    let x = coords["x"];
    let y = coords["y"];

    let index = selectedObject.checkVertex(x, y);

    if (index == -1) {
      gl_canvas.removeEventListener("contextmenu", deleteVertex);
      return;
    }

    selectedObject.vertices.splice(index, 1);
    selectedObject.vertices = ConvexHull(selectedObject.vertices);
    selectedObject.vertexCount--;
    selectedObject.count--;

    gl_canvas.removeEventListener("contextmenu", deleteVertex);

    renderAllObjects();
  }

  let colorPicker = document.getElementById("color-picker");

  colorPicker.addEventListener("change", function updateAll() {
    let color = getColor();
    let rgbColor = [color.r / 255, color.g / 255, color.b / 255, 1.0];

    selectedObject.vertices.forEach((vertex) => {
      vertex.color = rgbColor;
    });
    selectedObject.color = rgbColor;
    renderAllObjects();

    colorPicker.removeEventListener("change", updateAll);
  });

  function addVertex(event) {
    let coords = getCoords(gl_canvas, event);
    let x = coords["x"];
    let y = coords["y"];
    let object = getObject(gl_canvas, event);

    if (object != null) {
      gl_canvas.removeEventListener("click", addVertex);

      return;
    }

    const newVertex = {
      id: selectedObject.vertexCount,
      position: [x, y],
      color: selectedObject.color,
    };

    selectedObject.vertices.push(newVertex);
    selectedObject.vertices = ConvexHull(selectedObject.vertices);
    selectedObject.vertexCount = selectedObject.vertices.length;
    selectedObject.count = selectedObject.vertices.length;

    gl_canvas.removeEventListener("click", addVertex);
    remove(event);
    renderAllObjects();
  }

  function rotateObject() {
    var angle = document.getElementById("rotate").value;
    for (let i = 0; i < selectedObjectTemp.length; i++) {
      selectedObjectTemp[i].rotate(angle);
    }
    selectedObject.rotate(angle);
    renderAllObjects();
  }

  document.getElementById("range-slider").style.visibility = "visible";
  if (selectedObject.type != "POLY" && selectedObject.type != "LINE") {
    document.getElementById("input-resize").style.visibility = "visible";
    document.getElementById("submitResize-button").style.visibility = "visible";
    if(selectedObject.type == "SQUARE"){
      document.getElementById("input-2").style.visibility = "hidden";
    }
    if(selectedObject.type == "RECT"){
      document.getElementById("input-2").style.visibility = "visible";
    }
    
  }
  let rotateSlider = document.getElementById("rotate");
  rotateSlider.addEventListener("input", rotateObject);

  function remove(event) {
    // alert("CPPPL")
    const obj = getObject(gl_canvas, event);
    
    if (obj == null || obj.selected == selectedObject) {
      saveModelButton.disabled = true;
      gl_canvas.removeEventListener("contextmenu", deleteVertex);
      gl_canvas.removeEventListener("click", addVertex);
      gl_canvas.removeEventListener("contextmenu", remove);
      gl_canvas.removeEventListener("click", remove);
      rotateSlider.removeEventListener("input", rotateObject);
      document.getElementById("range-slider").style.visibility = "hidden";
      document.getElementById("input-resize").style.visibility = "hidden";
      document.getElementById("input-2").style.visibility = "hidden";
      document.getElementById("submitResize-button").style.visibility = "hidden";

      renderAllObjects();
    }
  }

  gl_canvas.addEventListener("mousedown", function select(event) {
    let coords = getCoords(gl_canvas, event);
    let x = coords["x"];
    let y = coords["y"];
    let copy = [];
    for (let j = 0; j < selectedObjectTemp.length; j++) {
      copy.push(JSON.parse(JSON.stringify(selectedObjectTemp[j].vertices)));
    }
    function drag(e) {
      let newCoords = getCoords(gl_canvas, e);
      let newX = newCoords["x"];
      let newY = newCoords["y"];

      for (let j = 0; j < selectedObjectTemp.length; j++) {
        for (let i = 0; i < copy[j].length; i++) {
          selectedObjectTemp[j].vertices[i].position[0] =
            copy[j][i].position[0] + (newX - x);
            selectedObjectTemp[j].vertices[i].position[1] =
            copy[j][i].position[1] + (newY - y);
        }
      }

      renderAllObjects();

      for (let j = 0; j < selectedObjectTemp.length; j++) {
        selectedObjectTemp[j].vertices.forEach((vertex) => {
          let point = getPoint(vertex.position[0], vertex.position[1], true);
          drawObject(gl, programInfo, point, gl.TRIANGLE_FAN, 4);
        });
      }
    }

    gl_canvas.addEventListener("mousemove", drag);
    gl_canvas.addEventListener("mouseup", function end() {
      gl_canvas.removeEventListener("mousemove", drag);
      gl_canvas.removeEventListener("mouseup", end);
      gl_canvas.removeEventListener("mousedown", select);
    });
  });

  if (selectedObject.type == "POLY") {
    gl_canvas.addEventListener("contextmenu", deleteVertex);
    gl_canvas.addEventListener("click", addVertex);
  }

  gl_canvas.addEventListener("click", remove);
  gl_canvas.addEventListener("contextmenu", remove);
};

document.addEventListener("keydown", (event) => {
  const keyName = event.key;

  function selectUnion(event) {
    let coords = getCoords(gl_canvas, event);
    selectObject(coords["x"], coords["y"], true);
  }

  if (keyName == "Shift") {
    gl_canvas.addEventListener("dblclick", selectUnion);
  }

  document.addEventListener("keyup", (event) => {
    const keyName = event.key;
    if (keyName == "Shift") {
      gl_canvas.removeEventListener("dblclick", selectUnion);
    }
  });
});

gl_canvas.addEventListener("dblclick", function select(event) {
  event.preventDefault();
  let coords = getCoords(gl_canvas, event);
  selectObject(coords["x"], coords["y"], false);
});

const clearCanvas = () => {
  objects = [];
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  enableAllButtons();
};

const resizeObject = () =>{
  var satuanGeserX = document.getElementById("resizeX").value;
  var satuanGeserY = document.getElementById("resizeY").value;
  for(let i = 0; i<selectedObjectTemp.length; i++){
    selectedObjectTemp[i].resizeByMetrix(satuanGeserX, satuanGeserY);
  }
  renderAllObjects();
}

const saveFile = (object = objects) => {
  const fileName = document.getElementById(Array.isArray(object) ? "filename" : "model-filename").value;

  if (fileName == "") {
    alert("Please input the output file name!");
    return;
  }

  const content = JSON.stringify(object);

  const file = new Blob([content], {
    type: "json/javascript",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = `${fileName}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const loadFile = () => {
  const selectedFile = document.getElementById("load-file").files[0];

  const reader = new FileReader();

  reader.readAsText(selectedFile, "UTF-8");

  reader.onload = (evt) => {
    let temp = JSON.parse(evt.target.result);
    temp = Array.isArray(temp) ? temp : [temp]

    let tempObjects = [];

    temp.forEach((item) => {
      let obj = null;
      if (item.type == "LINE" || item.type == "POLY") {
        obj = new Model(
          ConvexHull(item.vertices),
          item.vertexCount,
          item.type,
          item.color,
          item.completed,
          item.count
        );
      } else {
        alert(
          `Error in loading file: object type ${item.type} not recognized!`
        );
      }
      tempObjects.push(obj);
    });

    objects = tempObjects;
    console.log(objects);
    renderAllObjects();

    alert("Successfully loaded file!");
  };
};
