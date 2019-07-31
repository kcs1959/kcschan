function createBuffer(gl, data) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buf;
}

function attachBuffer(gl, vao, buf, id, dim) {
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(id);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(id, dim, gl.FLOAT, false, 0, 0);
}