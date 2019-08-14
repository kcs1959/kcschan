var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;

var portrait_turn_left = false;
var portrait_turn_right = false;

portrait_main();

function portrait_main() {
    const vert = `#version 300 es
        precision mediump float;

        layout (location=0) in vec3 in_pos;
        layout (location=1) in vec3 in_nrm;
        layout (location=2) in vec2 in_uv;

        uniform mat4 MVP;

        out vec2 v2f_uv;
        void main() {
            v2f_uv = in_uv;
            gl_Position = MVP * vec4(in_pos, 1);
            gl_Position /= gl_Position.w;
        }
    `;
    
    const frag = `#version 300 es
        precision mediump float;

        in vec2 v2f_uv;

        uniform sampler2D tex;
    
        out vec4 col;
        void main() {
            col.rgb = texture(tex, v2f_uv).rgb;
            col.a = 1.0;
        }
    `;

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const tex = createTexture(gl, 'img/body.png', gl.RGBA, gl.UNSIGNED_BYTE);
    const tex2 = createTexture(gl, 'img/hair.jpg', gl.RGBA, gl.UNSIGNED_BYTE);
    const tex3 = createTexture(gl, 'img/uniform.png', gl.RGBA, gl.UNSIGNED_BYTE);

    const prog = createProgram(gl, vert, frag, ["MVP", "tex"]);
    const prog2 = createProgram(gl, vert, frag, ["MVP", "tex"]);
    const prog3 = createProgram(gl, vert, frag, ["MVP", "tex"]);
    
    const skinProg = null;
    loadString('glsl/skin_tf.vs', function(vs) {
        loadString('glsl/skin_tf.fs', function(fs) {
            createTFProgram(gl, vs, fs, ["outPos", "outNrm", "outUv"], ["vertCount", "dats", "mats", "shps", "shpWs"]);
        });
    });

    const model = loadObj(gl, "data/kcschan.obj");
    const model2 = loadObj(gl, "data/hair.obj");
    const model3 = loadObj(gl, "data/uniform.obj");
    
    var P = mat4.create();
    mat4.fromScaling(P, vec3.fromValues(canvas.clientHeight * 1.0 / canvas.clientWidth, 1, 1));

    var then = 0;
    var rot = 0;
    const rotSp = 2;
    
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        const scl = 2.6;

        if (portrait_turn_left)
            rot -= rotSp * deltaTime;
        if (portrait_turn_right)
            rot += rotSp * deltaTime;

        var MV = mat4.create();
        var MV2 = mat4.create();
        mat4.fromYRotation(MV, rot);
        mat4.fromScaling(MV2, vec3.fromValues(-scl, scl, scl));
        mat4.mul(MV, MV2, MV);
        mat4.fromTranslation(MV2, vec3.fromValues(0, -1.0, 0));
        mat4.mul(MV, MV2, MV);
        var MVP = mat4.create();
        mat4.mul(MVP, P, MV);

        gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        prog.bind();
        gl.uniformMatrix4fv(prog.uniforms[0], false, MVP);
        tex.bind(prog.uniforms[1], 0);
        model.bindAndDrawGL();
        prog2.bind();
        gl.uniformMatrix4fv(prog2.uniforms[0], false, MVP);
        tex2.bind(prog2.uniforms[1], 0);
        model2.bindAndDrawGL();
        prog3.bind();
        gl.uniformMatrix4fv(prog3.uniforms[0], false, MVP);
        tex3.bind(prog3.uniforms[1], 0);
        model3.bindAndDrawGL();
    
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

