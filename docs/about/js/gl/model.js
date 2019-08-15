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
        allGrpWts: []
    };
}

function createModelBuffersSt(gl) {
    return {
        vao : null, vao_tf : null,
        vbos : [], vbos_tf : [],
        elo : null,
        grpId : null,
        grpWt : null,
        vcnt : 0,
        tcnt : 0,
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

function genModelBuffers(gl, model) {
    const vao = gl.createVertexArray();

    const vb = createBuffer(gl, new Float32Array(model.verts));
    const nb = createBuffer(gl, new Float32Array(model.norms));
    const ub = createBuffer(gl, new Float32Array(model.uvs));
    const tb = createBuffer(gl, new Uint16Array(model.tris), gl.ELEMENT_ARRAY_BUFFER);

    attachBuffer(gl, vao, vb, 0, 3);
    attachBuffer(gl, vao, nb, 1, 3);
    attachBuffer(gl, vao, ub, 2, 2);

    bufs = createModelBuffersSt(gl);
    bufs.vao = vao;
    bufs.vbos = [ vb, nb, ub ];
    bufs.elo = tb;
    
    if (model.skinned) {
        
        const vao2 = gl.createVertexArray();
        const vb2 = createBuffer(gl, new Float32Array(model.verts));
        const nb2 = createBuffer(gl, new Float32Array(model.norms));
        const ub2 = createBuffer(gl, new Float32Array(model.uvs));
        
        attachBuffer(gl, vao2, vb2, 0, 3);
        attachBuffer(gl, vao2, nb2, 1, 3);
        attachBuffer(gl, vao2, ub2, 2, 2);
        
        const gid = createBuffer(gl, new Int32Array(model.grpIds));
        const gwt = createBuffer(gl, new Float32Array(model.grpWts));

        bufs.vao_tf = vao2;
        bufs.vbos_tf = [ vb2, nb2, ub2 ];
        bufs.grpId = gid;
        bufs.grpWt = gwt;
    }
    
    return bufs;
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