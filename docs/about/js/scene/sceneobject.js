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
        
        updateMatrices : function() {
            mat4.fromRotationTranslationScale(this.localMatrix, this.position, this.rotation, this.scale);
            this.updateWorldMatrix();
        },
        updateWorldMatrix : function() {
            if (parentObj === null) {
                this.worldMatrix = mat4.create(this.localMatrix);
            }
            else {
                mat4.mul(this.worldMatrix, activeScene.objects[parentObj].localMatrix, this.localMatrix);
            }
            childObjs.forEach(function(o) {
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
        }
    };
}