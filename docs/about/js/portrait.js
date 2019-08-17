var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;
var quat = glMatrix.quat;

var portrait_turn_left = false;
var portrait_turn_right = false;

var portrait_clothes_id = 0;
var portrait_clothes_list = [];
var portrait_clothes_objs = [];

portrait_main();

var preupdate_comps = [];

var empty_vao = null;

function portrait_main() {
    const canvas = document.querySelector("#portrait_canvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        console_log("Cannot initialize webgl2!");
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

    empty_vao = gl.createVertexArray();

    const anim = loadAnimClip(gl, 'data/kcschan_blend/idle1.animclip');

    var hb = null;
    var bb = null;

    loadBlend(gl, 'data/kcschan', function() {
        const arm = activeScene.objects[0].findByNm("Armature");
        const arma = arm.components[0];
        arma.anim = anim;
        arma.initMats();
        hb = arm.findByNm("head");
        bb = arm.findByNm("body1");
    });

    const prog = createProgram(gl, 'glsl/unlit.vs', 'glsl/unlit.fs', ["MVP", "tex"]);
    skinning_shad = createTFProgram(gl, 'glsl/skin_tf.vs', 'glsl/skin_tf.fs', ["outPos", "outNrm", "outUv"], ["vertCount", "shpCount", "poss", "nrms", "uvs", "dats", "mats", "shps", "shpWs"]);    

    var then = 0;
    var rot = 0;
    const rotSp = 2;

    var _portrait_clothes_id = portrait_clothes_id;

    function render(now) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        const scl = 0.25;
        const y = -1;

        if (portrait_turn_left)
            rot += rotSp * deltaTime;
        if (portrait_turn_right)
            rot -= rotSp * deltaTime;
            
        if (_portrait_clothes_id != portrait_clothes_id) {
            _portrait_clothes_id = portrait_clothes_id;
            portrait_clothes_objs.forEach(function(oo, i) {
                oo.forEach(function(o) {
                    o.enabled = _portrait_clothes_id == i;
                });
            });
        }

        if (hb) {
            quat.fromEuler(hb.rotation, Math.sin(now*1.5 - 1.5) * 1 - 9, 0, 0);
            quat.fromEuler(bb.rotation, Math.sin(now*1.5) * 1 + 10, 0, 0);
            hb.updateMatrices();
            bb.updateMatrices();
        }

        var P = mat4.create();
        var P2 = mat4.create();
        mat4.fromScaling(P, vec3.fromValues(canvas.clientHeight * scl / canvas.clientWidth, scl, scl));
        mat4.fromYRotation(P2, rot);
        mat4.mul(P, P2, P);
        mat4.fromTranslation(P2, vec3.fromValues(0, y, 0));
        mat4.mul(P, P2, P);

        preupdate_comps.forEach(c => {
            c.preupdate(now, gl);
        });
        renderScene(gl, P, prog);
        
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

