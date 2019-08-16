function createArmatureBone(nm) {
    return {
        name : nm,
        fullName : nm,
        length : 0,
        restMat : mat4.create(),
        animMat : mat4.create(),
        parentBn : null,
        object : null
    }
}

function createArmature() {
    return {
        name : "Armature",
        ctype : 1,
        obj : null,
        anim : null,
        bones : []
    };
}