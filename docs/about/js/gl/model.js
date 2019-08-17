function createModelGroupWeightSt() {
    return {
        id : 0,
        val : 0.0
    };
}

function createModelSt() {
    return {
        verts : [],
        norms : [],
        tris : [],
        uvs : [],
        skinned : false,
        grpIds : [],
        grpWts : [],
        allGrpNms : [],
        allGrpWts: [],
        shapes : [],
        shapeNms : []
    };
}

function createModelBuffersSt(gl) {
    return {
        loaded : false,
        vao : null,
        vbos : [],
        vbosTex : [],
        elo : null,
        vcnt : 0,
        tcnt : 0,
        data : null,
        bindGL : function() {
            if (!this.loaded) return;
            gl.bindVertexArray(this.vao);
            this.elo.bindGL();
        },
        unbindGL : function() {
            if (!this.loaded) return;
            gl.bindVertexArray(null);
            this.elo.unbindGL();
        },
        bindAndDrawGL : function() {
            if (!this.loaded) return;
            this.bindGL();
            gl.drawElements(gl.TRIANGLES, this.tcnt * 3, gl.UNSIGNED_SHORT, 0);
        }
    };
}

function genModelBuffers(gl, model) {
    const vao = gl.createVertexArray();

    const v = new Float32Array(model.verts);
    const n = new Float32Array(model.norms);
    const u = new Float32Array(model.uvs);

    const vb = createBuffer(gl, v);
    const nb = createBuffer(gl, n);
    const ub = createBuffer(gl, u);
    const tb = createBuffer(gl, new Uint16Array(model.tris), gl.ELEMENT_ARRAY_BUFFER);

    attachBuffer(gl, vao, vb, 0, 3);
    attachBuffer(gl, vao, nb, 1, 3);
    attachBuffer(gl, vao, ub, 2, 2);
    ub.unbindGL();

    bufs = createModelBuffersSt(gl);
    bufs.vcnt = v.length / 3;
    bufs.tcnt = model.tris.length / 3;
    bufs.vao = vao;
    bufs.vbos = [ vb, nb, ub ];
    bufs.elo = tb;
    bufs.data = model;
    
    if (model.skinned) {
        const vb2 = createBufTexture(gl, v, 3, gl.RGB32F, gl.RGB);
        const nb2 = createBufTexture(gl, n, 3, gl.RGB32F, gl.RGB);
        const ub2 = createBufTexture(gl, u, 2, gl.RG32F, gl.RG);

        bufs.vbosTex = [ vb2, nb2, ub2 ];
    }
    
    return bufs;
}

function updateModelBuffers(gl, modelGL, model) {
    const v = new Float32Array(model.verts);
    const n = new Float32Array(model.norms);
    const u = new Float32Array(model.uvs);
    if (model.skinned) {
        updateTexture(gl, modelGL.vbosTex[0], v);
        updateTexture(gl, modelGL.vbosTex[1], n);
        updateTexture(gl, modelGL.vbosTex[2], u);
    }
    setBufferData(gl, modelGL.vbos[0], v);
    setBufferData(gl, modelGL.vbos[1], n);
    setBufferData(gl, modelGL.vbos[2], u);
    attachBuffer(gl, modelGL.vao, modelGL.vbos[0], 0, 3);
    attachBuffer(gl, modelGL.vao, modelGL.vbos[1], 1, 3);
    attachBuffer(gl, modelGL.vao, modelGL.vbos[2], 2, 2);
    modelGL.vbos[2].unbindGL();
    setBufferData(gl, modelGL.elo, new Uint16Array(model.tris), gl.ELEMENT_ARRAY_BUFFER);
    modelGL.vcnt = model.verts.length / 3;
    modelGL.tcnt = model.tris.length / 3;
}