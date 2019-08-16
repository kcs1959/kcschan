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
            anim.setTime(t);
            bones.forEach(function(b) {
                b.eval(anim);
            });
        },
        updateBuffers : function(gl) {
            const buf = new Float32Array(bones.length * 16);
            bones.forEach(function(b, i) {
                buf.set(b.animMat, i * 16);
            });
            if (!this.matTex) {
                createBufTexture(gl, buf, gl.RGBA, gl.FLOAT);
            }
            else {
                updateTexture(gl, this.matTex, buf);
            }
        }
    };
}