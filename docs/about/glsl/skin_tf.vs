#version 300 es
precision mediump float;

const int TEXBUF_MAXSIZE = 1024;

uniform int vertCount;
uniform int shpCount;

uniform sampler2D poss;
uniform sampler2D nrms;
uniform sampler2D uvs;
uniform sampler2D dats;
uniform sampler2D mats;
uniform sampler2D shps;
uniform sampler2D shpWs;

out vec3 outPos;
out vec3 outNrm;
out vec2 outUv;

vec4 _texelFetch(sampler2D buf, int id) {
    int idy = id / TEXBUF_MAXSIZE;
    return texelFetch(buf, ivec2(id - TEXBUF_MAXSIZE * idy, idy), 0);
}

mat4 buf2mat (sampler2D buf, int id) {
    id *= 4;
    mat4 res;
    res[0] = _texelFetch(buf, id);
    res[1] = _texelFetch(buf, id+1);
    res[2] = _texelFetch(buf, id+2);
    res[3] = _texelFetch(buf, id+3);
    return res;
}

void main() {
    int gid = gl_VertexID;
    vec3 in_pos = _texelFetch(poss, gid).xyz;
    vec3 in_nrm = _texelFetch(nrms, gid).xyz;
    vec2 in_uv = _texelFetch(uvs, gid).xy;
    vec4 dt_mats = _texelFetch(dats, gid * 2);
    vec4 dt_ws = _texelFetch(dats, gid * 2 + 1);
    mat4 m = buf2mat(mats, int(dt_mats[0]))*dt_ws[0];
        + buf2mat(mats, int(dt_mats[1]))*dt_ws[1]
        + buf2mat(mats, int(dt_mats[2]))*dt_ws[2]
        + buf2mat(mats, int(dt_mats[3]))*dt_ws[3];
    vec4 p = vec4(in_pos, 1);
    vec4 n = vec4(in_nrm, 0);
    //for (int s = 0; s < shpCount; s++) {
    //    p += _texelFetch(shps, s*vertCount + gid) * _texelFetch(shpWs, s).r;
    //}
    p.w = 1.0;
    p = m * p;
    outPos = p.xyz / p.w;
    outNrm = (m * n).xyz;
    outUv = in_uv;
    gl_Position.xyz = outPos; gl_Position.w = 1.0;
}