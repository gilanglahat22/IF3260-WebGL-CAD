let normalize = false; // gaperlu dinormalisasi
let stride = 0; // berapa banyak byte dari 1 set of values, kalo 0 berarti ngikutin numComponents dan Type
let offset = 0; // offset untuk buffer

const setPositionAttribute = (gl, programInfo, vertices) => {
  const numComponents = 2; // keluarin 2 value per iterasi
  const type = gl.FLOAT;

  const positionBuffer = initPositionBuffer(gl, vertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );

  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
};

const setColorAttribute = (gl, programInfo, colors) => {
  const numComponents = 4;
  const type = gl.FLOAT;

  const colorBuffer = initColorBuffer(gl, colors);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );

  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
};

const drawObject = (gl, programInfo, vertices, mode, vertexCount) => {
  let positions = [];
  let colors = [];

  if (Array.isArray(vertices)) {
    for (let i = 0; i < vertices.length; i++) {
      positions.push(vertices[i].position[0]);
      positions.push(vertices[i].position[1]);
      colors.push(vertices[i].color[0]);
      colors.push(vertices[i].color[1]);
      colors.push(vertices[i].color[2]);
      colors.push(vertices[i].color[3]);
    }
  } else {
    positions = vertices.position;
    colors = vertices.color;
  }

  gl.canvas.width = 0.9 * window.innerWidth;
  gl.canvas.height = 0.9 * window.innerWidth;

  setPositionAttribute(gl, programInfo, positions);
  setColorAttribute(gl, programInfo, colors);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(programInfo.program);
  gl.drawArrays(mode, 0, vertexCount);
};
