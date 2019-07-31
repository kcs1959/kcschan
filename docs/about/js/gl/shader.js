function createShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('Error compiling shader: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vs, fs, vrs) {
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
        console.log('Error linking program: ' + gl.getProgramInfoLog(prog));
        return null;
    }

    uniforms = [];
    vrs.forEach(function (v) {
        uniforms.push(gl.getUniformLocation(prog, v));
    });

    return {
        pointer : prog,
        uniforms : uniforms
    };
}