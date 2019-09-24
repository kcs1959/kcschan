#version 300 es
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