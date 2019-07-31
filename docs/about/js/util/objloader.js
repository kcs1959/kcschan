function loadObj(gl, path) {
    var model = createModel();

    var modelGL = genModelBuffers(gl, model);

    loadString(path, function(str) {
        model.verts = [
            -1.0, -1.0, 0,
            1.0, 0.0, 0,
            -0.5, 1.0, 0
        ];
        model.tris = [ 0, 1, 2 ];
        updateModelBuffers(gl, modelGL, model);
    });

    return modelGL;
}