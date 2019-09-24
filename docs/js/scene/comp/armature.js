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
        initAnimMat : function(ibase) {
            mat4.mul(this.irestMat, ibase, this.object.worldMatrix);
            mat4.invert(this.irestMat, this.irestMat);
        },
        updateAnimMat : function(ibase) {
            mat4.mul(this.animMat, ibase, this.object.worldMatrix);
            mat4.mul(this.animMat, this.animMat, this.irestMat);
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
        initMats : function(gl) {
            const wm = mat4.create();
            mat4.invert(wm, this.obj.worldMatrix);
            this.bones.forEach(function(b) {
                b.initAnimMat(wm);
            });
        },
        updateMats : function(gl) {
            const wm = mat4.create();
            mat4.invert(wm, this.obj.worldMatrix);
            this.bones.forEach(function(b) {
                b.updateAnimMat(wm);
            });
        },
        updateBuffers : function(gl) {
            const buf = new Float32Array(this.bones.length * 16);
            this.bones.forEach(function(b, i) {
                buf.set(b.animMat, i * 16);
            });
            if (!this.matTex) {
                console_log("gen arm for " + this.bones.length + " bones");
                this.matTex = createBufTexture(gl, buf);
            }
            else {
                updateTexture(gl, this.matTex, buf);
            }
        },
        preupdate : function(t, gl) {
            this.updateMats(gl);
            this.updateBuffers(gl);
        },
        mapBone : function(nm) {
            return this.bones.findIndex(b => {
                return b.name == nm;
            });
        }
    };
}