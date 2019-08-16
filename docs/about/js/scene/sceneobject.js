function createSceneObject(name = "unnamed object") {
    return {
        enabled : true,
        name : name,
        position : vec3.create(),
        rotation : quat.create(),
        scale : vec3.fromValues(1, 1, 1),
        localMatrix : mat4.create(),
        worldMatrix : mat4.create(),
        components : [],
        parentObj : null,
        childObjs : [],
        
        setWorldPos : function(v) {
            if (!this.parentObj) this.position = v;
            else {
                var im = mat4.create();
                mat4.invert(im, this.parentObj.worldMatrix);
                position = mat_vec3_w(im, v, 1);
            }
        },
        updateMatrices : function() {
            mat4.fromRotationTranslationScale(this.localMatrix, this.rotation, this.position, this.scale);
            this.updateWorldMatrix();
        },
        updateWorldMatrix : function() {
            if (!this.parentObj) {
                this.worldMatrix = mat4.create(this.localMatrix);
            }
            else {
                mat4.mul(this.worldMatrix, this.parentObj.worldMatrix, this.localMatrix);
            }
            this.childObjs.forEach(function(o) {
                o.updateWorldMatrix();
            });
        },
        addChild : function(o) {
            this.childObjs.push(o);
            o.parentObj = this;
        },
        findByNm : function(nm) {
            if (this.name == nm) return this;
            for (let o of this.childObjs) {
                const res = o.findByNm(nm);
                if (res != null) return res;
            }
            return null;
        },
        addComponent : function(c) {
            this.components.push(c);
            c.obj = this;
        }
    };
}