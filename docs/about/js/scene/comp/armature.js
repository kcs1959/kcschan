function createArmatureBone(nm) {
    return {
        name : nm,
        fullName : nm,
        length : 0,
        irestMat : mat4.create(),
        animMat : mat4.create(),
        parentBn : null,
        object : null,
        animId : 0,

        updateAnimId : function(anim) {
            this.animId = anim.keys.find(function(v) {
                return v.name == this.fullName;
            });
        },
        eval : function(anim) {

        },
        updateAnimMat : function(ibase) {
            mat4.mul(this.animMat, ibase, this.object.worldMatrix);
            mat4.mul(this.animMat, this.irestMat, this.animMat);
        }
    }
}

function createArmature() {
    return {
        name : "Armature",
        ctype : 1,
        obj : null,
        anim : null,
        bones : [],
        matTex : null,

        animate : function(t) {
            if (!anim) return;
            this.anim.setTime(t);
            this.bones.forEach(function(b) {
                b.eval(anim);
            });
        },
        updateBuffers : function(gl) {
            const buf = new Float32Array(this.bones.length * 16);
            this.bones.forEach(function(b, i) {
                buf.set(b.animMat, i * 16);
            });
            if (!this.matTex) {
                this.matTex = createBufTexture(gl, buf, gl.RGBA, gl.FLOAT);
            }
            else {
                updateTexture(gl, this.matTex, buf);
            }
        },
        preupdate : function(t, gl) {
            this.updateBuffers(gl);
        }
    };
}