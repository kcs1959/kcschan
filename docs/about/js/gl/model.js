function createModel() {
    return {
        verts : [],
        norms : [],
        tris : [],
        uvs : []
    };
}

function genModelBuffers(gl, model) {
    const vao = gl.createVertexArray();

    const vb = createBuffer(gl, new Float32Array(model.verts));
    const nb = createBuffer(gl, new Float32Array(model.norms));
    const ub = createBuffer(gl, new Float32Array(model.uvs));
    const tb = createBuffer(gl, new Uint16Array(model.tris), gl.ELEMENT_ARRAY_BUFFER);

    attachBuffer(gl, vao, vb, 0, 3);
    attachBuffer(gl, vao, nb, 1, 3);
    attachBuffer(gl, vao, ub, 2, 2);

    return {
        vao : vao,
        vbos : [ vb, nb, ub ],
        elo : tb,
        vcnt : model.verts.length / 3,
        tcnt : model.tris.length / 3,
        bindGL : function() {
            gl.bindVertexArray(this.vao);
            this.elo.bindGL();
        },
        bindAndDrawGL : function() {
            this.bindGL();
            gl.drawElements(gl.TRIANGLES, this.tcnt * 3, gl.UNSIGNED_SHORT, 0);
        }
    };
}

function updateModelBuffers(gl, modelGL, model) {
    setBufferData(gl, modelGL.vbos[0], new Float32Array(model.verts));
    setBufferData(gl, modelGL.vbos[1], new Float32Array(model.norms));
    setBufferData(gl, modelGL.vbos[2], new Float32Array(model.uvs));
    attachBuffer(gl, modelGL.vao, modelGL.vbos[0], 0, 3);
    attachBuffer(gl, modelGL.vao, modelGL.vbos[1], 1, 3);
    attachBuffer(gl, modelGL.vao, modelGL.vbos[2], 2, 2);
    setBufferData(gl, modelGL.elo, new Uint16Array(model.tris), gl.ELEMENT_ARRAY_BUFFER);
    modelGL.vcnt = model.verts.length / 3;
    modelGL.tcnt = model.tris.length / 3;
}