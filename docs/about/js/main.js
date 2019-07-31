main();

function main() {
    const vert = `#version 300 es
        precision mediump float;

        layout (location=0) in vec2 ipos;

        out vec3 pos;
        void main() {
            pos.xy = ipos;
            pos.z = 0.0;
            gl_Position = vec4(pos, 1);
        }
    `;
    
    const frag = `#version 300 es
        precision mediump float;

        in vec3 pos;
    
        out vec4 col;
        void main() {
            col.r = pos.x * 0.5 + 0.5;
            col.g = pos.y * 0.5 + 0.5;
            col.b = 0.0;
            col.a = 1.0;
        }
    `;

    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const prog = createProgram(gl, vert, frag);
    const vao = gl.createVertexArray();

    const vbo = createBuffer(gl, new Float32Array([
        -1.0, -1.0,
        1.0, 0.0,
        -0.5, 1.0
    ]))

    attachBuffer(gl, vao, vbo, 0, 2);

    {
        gl.useProgram(prog);
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}