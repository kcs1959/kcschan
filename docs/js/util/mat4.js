function mat_vec3_w(m, v, w) {
    const w2 = 1 / (m[3] * v[0] + m[4] * v[1] + m[11] * v[2] + m[15] * w);
    return vec3.fromValues(
        (m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * w) * w2,
        (m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * w) * w2,
        (m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * w) * w2
    );
}