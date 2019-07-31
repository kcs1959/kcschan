main();

function main() {
    const vert = `#version 300 es
        precision mediump float;

        layout (location=0) in vec2 ipos;

        out vec2 v2f_uv;
        void main() {
            v2f_uv = ipos * 0.5 + 0.5;
            v2f_uv.y = 1.0 - v2f_uv.y;
            gl_Position = vec4(ipos, 0, 1);
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

    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        console.log("Cannot initialize webgl2!");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const prog = createProgram(gl, vert, frag, ["tex"]);
    const vao = gl.createVertexArray();

    const vbo = createBuffer(gl, new Float32Array([
        -1.0, -1.0,
        1.0, 0.0,
        -0.5, 1.0
    ]))

    attachBuffer(gl, vao, vbo, 0, 2);

    const tex = createTexture(gl, 'img/rabbit.png', gl.RGBA, gl.UNSIGNED_BYTE);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data/asdf.bin", true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        const abuf = xhr.response;
        const fbuf = new Float32Array(abuf);
        console.log(fbuf[0]);
    }
    xhr.send();
    
    
    var then = 0;

    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        const tt = now * Math.PI;
        const tt2 = tt + Math.PI * 2.0 / 3.0;
        const tt3 = tt + Math.PI * 4.0 / 3.0;

        setBufferData(gl, vbo, new Float32Array([
            Math.sin(tt), Math.cos(tt),
            Math.sin(tt2), Math.cos(tt2),
            Math.sin(tt3), Math.cos(tt3)
        ]), 0);
    
        gl.useProgram(prog.pointer);
        gl.uniform1i(prog.uniforms[0], 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

