var skinning_shad = null;

function createSkinnedMeshRenderer() {
    return {
        name : "Skinned Mesh Renderer",
        ctype : 3,
        obj : null,
        mesh : null,
        arma : null,
        tex : null,
        datTex : null,

        createDatTex : function(gl) {
            const dat = new Float32Array(this.mesh.vcnt * 8);
            for (let i = 0; i < this.mesh.vcnt; i++) {
                var a = 0;
                var sw = 0;
                for (let g = 0; g < this.mesh.allGrpWts; g++) {
                    const bi = this.arma.mapbone(this.mesh.allGrpNms);
                    if (bi == -1) continue;
                    dat[i*8 + a] = bi;
                    dat[i*8 + 4 + a] = this.mesh.allGrpWts[g];
                    a ++;
                    sw += this.mesh.allGrpWts[g];
                    if (a >= 4) break;
                }
                for (let n = 0; n < a; n++) {
                    dat[i*8 + 4 + n] /= sw;
                }
            }
            this.datTex = createBufTexture(gl, dat);
        },
        skin : function(gl) {
            if (!skinning_shad) return;
            skinning_shad.bind([
                this.mesh.vbos[0].pointer,
                this.mesh.vbos[1].pointer,
                this.mesh.vbos[2].pointer
            ]);
            gl.uniform1i(skinning_shad.uniforms[0], this.mesh.vcnt);
            gl.uniform1i(skinning_shad.uniforms[1], 0);
            this.datTex.bind(skinning_shad.uniforms[2], 0);
            this.arma.matTex.bind(skinning_shad.uniforms[3], 1);
            gl.bindVertexArray(this.mesh.vao_tf);
            this.mesh.elo.bindGL();
            skinning_shad.execE(this.mesh.vcnt);
        }
    };
}