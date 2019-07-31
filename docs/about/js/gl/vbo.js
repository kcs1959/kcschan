function createBuffer(gl, data, tp = gl.ARRAY_BUFFER) {
    const buf = gl.createBuffer();
    gl.bindBuffer(tp, buf);
    gl.bufferData(tp, data, gl.STATIC_DRAW);

    return {
        pointer : buf,
        type : tp,
        bindGL : function() {
            gl.bindBuffer(this.type, this.pointer);
        }
    };
}

function attachBuffer(gl, vao, buf, id, dim) {
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(id);
    buf.bindGL();
    gl.vertexAttribPointer(id, dim, gl.FLOAT, false, 0, 0);
}

function setBufferData(gl, buf, data) {
    buf.bindGL();
    gl.bufferData(buf.type, data, gl.STATIC_DRAW);
}

function setBufferSubData(gl, buf, data, off) {
    buf.bindGL();
    gl.bufferSubData(buf.type, off, data);
}