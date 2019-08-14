#version 300 es
precision mediump float;

in vec3 outPos;
in vec3 outNrm;
in vec2 outUv;

out vec4 outColor;

void main() {
    outColor = vec4(1, 1, 1, 1);
}