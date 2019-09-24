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
        shpTex : null,
        elo : null,
        vcnt : 0,
        tcnt : 0,
        scnt : 0,
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

    bufs.scnt = model.shapes.length;
    if (bufs.scnt > 0) {
        const s = new Float32Array(bufs.scnt * v.length);
        for (let a = 0; a < bufs.scnt; a++) {
            s.set(model.shapes[a], a * v.length);
        }
        bufs.shpTex = createBufTexture(gl, s, 3, gl.RGB32F, gl.RGB);
    }
    
    return bufs;
}