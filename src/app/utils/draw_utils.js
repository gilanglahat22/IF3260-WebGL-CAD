import { initPositionBuffer, initColorBuffer} from "./buffers.js ";

let normalize = false;      // gaperlu dinormalisasi
let stride = 0;             // berapa banyak byte dari 1 set of values, kalo 0 berarti ngikutin numComponents dan Type
let offset = 0;             // offset untuk buffer

const setPositionAttribute = (gl, programInfo, vertices) => {
    const numComponents = 2 // keluarin 2 value per iterasi
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
    )

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

const setColorAttribute = (gl, programInfo, colors) => {
    const numComponents = 3; // keluarin 3 value karena value warna ada R, G, B (kalo mo nambahin A juga bole)
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
    )

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export const drawObject = (gl, programInfo, vertices, color, mode, vertexCount) => {
    console.log("vertices from draw obj ", vertices);
    console.log("colors from draw obj", color    );
    setPositionAttribute(gl, programInfo, vertices);
    setColorAttribute(gl, programInfo, color);

    gl.useProgram(programInfo.program);
    gl.drawArrays(mode, 0, vertexCount);
}

