function renderScene(gl, P, prog) {
    var mrs = [];
    var smrs = [];

    var seek = function(oo) {
        oo.forEach(function(o) {
            o.components.forEach(function(c) {
                if (c.ctype == 2) {
                    mrs.push(c);
                }
                else if (c.ctype == 3) {
                    smrs.push(c);
                }
            });
            seek(o.childObjs);
        });
    }
    
    seek(activeScene.objects);

    var MVP = mat4.create();
    mrs.forEach(function(mr) {
        const MV = mr.obj.worldMatrix;
        mat4.mul(MVP, P, MV);
        gl.uniformMatrix4fv(prog.uniforms[0], false, MVP);
        mr.mesh.bindAndDrawGL();
    });
    smrs.forEach(function(mr) {
        const MV = mr.obj.worldMatrix;
        mat4.mul(MVP, P, MV);
        gl.uniformMatrix4fv(prog.uniforms[0], false, MVP);
        mr.mesh.bindAndDrawGL();
    });
}