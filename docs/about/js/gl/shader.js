function createShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vs, fs) {
    const vsh = createShader(gl, gl.VERTEX_SHADER, vs);
    const fsh = createShader(gl, gl.FRAGMENT_SHADER, fs);
    
    const prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    gl.detachShader(prog, vsh);
    gl.detachShader(prog, fsh);
    gl.deleteShader(vsh);
    gl.deleteShader(fsh);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(prog));
        return null;
    }

    return prog;
}