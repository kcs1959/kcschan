function vec3_cross(a, b) {
    var res = vec3.create();
    vec3.cross(res, a, b);
    return res;
}

function vec3_normalized(v) {
    var res = vec3.create();
    vec3.normalize(res, v);
    return res;
}

function vec3_add(v, f) {
    return vec3.fromValues(
        v[0] + f[0],
        v[1] + f[1],
        v[2] + f[2]
    );
}

function vec3_minus(v, f) {
    return vec3.fromValues(
        v[0] - f[0],
        v[1] - f[1],
        v[2] - f[2]
    );
}

function vec3_mul(v, f) {
    return vec3.fromValues(
        v[0] * f[0],
        v[1] * f[1],
        v[2] * f[2]
    );
}

function vec3_mulf(v, f) {
    return vec3.fromValues(
        v[0] * f,
        v[1] * f,
        v[2] * f
    );
}