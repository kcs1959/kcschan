function createArmatureBone(nm) {
    return {
        name : nm,
        fullName : nm,
        restMat : mat4.create(),
        animMat : mat4.create(),
        parentBn : null,
        object : null
    }
}

function createArmature() {
    return {
        anim : null,
        bones : []
    };
}