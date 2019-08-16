var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;
var quat = glMatrix.quat;

var portrait_turn_left = false;
var portrait_turn_right = false;

var portrait_clothes_id = 0;

portrait_main();

function portrait_main() {
    const canvas = document.querySelector("#portrait_canvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        console.log("Cannot initialize webgl2!");
        return;
    }

    var mouse_down = false;

    canvas.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        const mousePos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }, false);
    canvas.addEventListener('mousedown', function(event) {
        if (event.which === 1)
            mouse_down = true;
    });
    canvas.addEventListener('mouseup', function(event) {
        if (event.which === 1)
            mouse_down = false;
    });

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clearDepth(1.0);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const tex = createTexture(gl, 'img/body.png', gl.RGBA, gl.UNSIGNED_BYTE);
    const tex2 = createTexture(gl, 'img/hair.jpg', gl.RGBA, gl.UNSIGNED_BYTE);
    const tex3 = createTexture(gl, 'img/summer.png', gl.RGBA, gl.UNSIGNED_BYTE);

    loadBlend(gl,  'data/kcschan');

    const prog = createProgram(gl, 'glsl/unlit.vs', 'glsl/unlit.fs', ["MVP", "tex"]);
    
    const skinProg = createTFProgram(gl, 'glsl/skin_tf.vs', 'glsl/skin_tf.fs', ["outPos", "outNrm", "outUv"], ["vertCount", "dats", "mats", "shps", "shpWs"]);

    const modelc = loadCMesh(gl, "data/body.cmesh");
    const model2c = loadCMesh(gl, "data/hair.cmesh");
    const model3c = loadCMesh(gl, "data/summer.cmesh");
    
   
    var then = 0;
    var rot = 0;
    const rotSp = 2;

    var _portrait_clothes_id = portrait_clothes_id;
    
    function render(now) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        const scl = 0.15;

        if (portrait_turn_left)
            rot -= rotSp * deltaTime;
        if (portrait_turn_right)
            rot += rotSp * deltaTime;

        var P = mat4.create();
        var P2 = mat4.create();
        mat4.fromScaling(P, vec3.fromValues(canvas.clientHeight * 1.0 / canvas.clientWidth, 1, 1));
        mat4.fromYRotation(P2, rot);
        mat4.mul(P, P2, P);
        mat4.fromScaling(P2, vec3.fromValues(scl, scl, scl));
        mat4.mul(P, P2, P);

        prog.bind();
        tex.bind(prog.uniforms[1], 0);
        renderScene(gl, P, prog);
        
        /*
        var MV = mat4.create();
        mat4.fromTranslation(MV, vec3.fromValues(0, -11.0, 0));
        var MVP = mat4.create();
        mat4.mul(MVP, P, MV);

        prog.bind();
        gl.uniformMatrix4fv(prog.uniforms[0], false, MVP);
        tex.bind(prog.uniforms[1], 0);
        modelc.bindAndDrawGL();
        tex2.bind(prog.uniforms[1], 0);
        model2c.bindAndDrawGL();
        tex3.bind(prog.uniforms[1], 0);
        model3c.bindAndDrawGL();
        */
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

