// fungsi untuk membuat shader berdasarkan type dan source nya
const loadShader = (gl, type, source) => {
    // bikin shader baru berdasarkan type
    const shader = gl.createShader(type);
    
    // load source code ke shader
    gl.shaderSource(shader, source);

    // tes compile
    gl.compileShader(shader);

    // kalo COMPILE_STATUS ngga ada, berarti gagal compile
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert("Unable to compile shaders; check console for more information.");
        console.log(`Unable to compile shaders: ${gl.getShaderInfoLog(shader)}`);

        return null;
    }

    return shader;
}

// fungsi untuk inisiasi shader; return shaderProgram
export const initShaders = (gl, vsSource, fsSource) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // buat shader programnya
    const shaderProgram = gl.createProgram();
    
    // attach vertex shader & fragment shader
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // misalnya shader programnya gagal compile, return null
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to init shader program: check console for more information.`);
        console.log(`Unable to initialize shader program: ${gl.getProgramInfoLog(shaderProgram)}`);

        return null;
    }

    return shaderProgram;
}   
