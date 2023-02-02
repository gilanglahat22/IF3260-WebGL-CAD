let type = gl.FLOAT;        // tipe data bentuknya false
let normalize = false;      // gaperlu dinormalisasi
let stride = 0;             // berapa banyak byte dari 1 set of values, kalo 0 berarti ngikutin numComponents dan Type
let offset = 0;             // offset untuk buffer

const setPositionAttribute = (gl, programInfo) => {
    const numComponents = 2 // keluarin 2 value per iterasi


    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
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

const setColorAttribute = (gl, buffer, programInfo) => {
    const numComponents = 4; // keluarin 4 value karena value warna ada R, G, B, A

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);

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

export const drawObj = (gl, vertices, programInfo, mode) => {
    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    setPositionAttribute(gl, programInfo);
    setColorAttribute(gl, programInfo);

    gl.useProgram(programInfo.program);
    gl.drawArrays(mode, 0, n);
}
