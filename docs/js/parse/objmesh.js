function loadObj(gl, path, callback) {
    var model = createModelSt();

    loadString(path, function(str) {
        _verts = [];
        _norms = [];
        _uvs = [];
        var triMap = new Map();
        var triCnt = 0;

        const strs = splitLines(str);
        strs.forEach(function(s) {
            if (s[0] === '#') return;
            const ss = s.split(' ');
            const ss0 = ss[0];
            if (ss0 === 'v') {
                _verts.push(
                    parseFloat(ss[1]),
                    parseFloat(ss[2]),
                    parseFloat(ss[3])
                );
            }
            else if (ss0 == 'vn') {
                _norms.push(
                    parseFloat(ss[1]),
                    parseFloat(ss[2]),
                    parseFloat(ss[3])
                );
            }
            else if (ss0 == 'vt') {
                _uvs.push(
                    parseFloat(ss[1]),
                    1.0 - parseFloat(ss[2])
                );
            }
            else if (ss0 == 'f') {
                for (var a = 0; a < 3; a++) {
                    const ss1 = ss[a+1].split('/');
                    const i3 = [ parseInt(ss1[0]), 0, 0 ];
                    if (ss1.length > 1) {
                        if (ss1[1] != '') {
                            i3[1] = parseInt(ss1[1]);
                            if (ss1.length > 2) {
                                i3[2] = parseInt(ss1[2]);
                            }
                        }
                    }

                    const mk = i3[0] * 30000 * 30000 + i3[1] * 30000 + i3[2];
                    const ti = triMap.get(mk);
                    if (typeof ti === "undefined") {
                        triMap.set(mk, triCnt);
                        model.verts.push(
                            _verts[(i3[0] - 1) * 3],
                            _verts[(i3[0] - 1) * 3 + 1],
                            _verts[(i3[0] - 1) * 3 + 2]
                        );
                        if (i3[1] > 0) {
                            model.uvs.push(
                                _uvs[(i3[1] - 1) * 2],
                                _uvs[(i3[1] - 1) * 2 + 1]
                            );
                        }
                        if (i3[2] > 0) {
                            model.norms.push(
                                _norms[(i3[2] - 1) * 3],
                                _norms[(i3[2] - 1) * 3 + 1],
                                _norms[(i3[2] - 1) * 3 + 2]
                            );
                        }

                        model.tris.push(triCnt);
                        triCnt += 1;
                    }
                    else {
                        model.tris.push(ti);
                    }
                }
            }
        });

        var modelGL = genModelBuffers(gl, model);
        modelGL.loaded = true;
        console_log('loaded obj file ' + path + ' (' + _verts.length.toString() + ' vertices, ' + triCnt.toString() + ' triangles)');
        return modelGL;
    });
}