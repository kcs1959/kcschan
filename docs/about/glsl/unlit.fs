#version 300 es
precision mediump float;

in vec2 v2f_uv;

uniform sampler2D tex;

out vec4 col;
void main() {
    col.rgb = texture(tex, v2f_uv).rgb;
    col.a = 1.0;
}