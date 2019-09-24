function loadCMesh(gl, path, skin = false, onload = null) {
    var model = createModelSt();
    model.skinned = skin;
    
    loadBinary(path, function(bstrm) {
        var off = 0;
        
        var decoder = new TextDecoder();
        const sig = decoder.decode(new DataView(bstrm, 0, 6));
        if (sig != "KTO123") {
            console_log('unexpected mesh signature:"' + sig + '"');
            return;
        }
        off += 6;
        const nm = readString(new DataView(bstrm, off, 50));
        off += nm.length + 1;
        
        var dv = new DataView(bstrm);
        var dtype = dv.getInt8(off, true); off += 1;
        
        var _vcnt = 0;
        var _tcnt = 0;

        while (dtype != 0) {
            const cdtype = String.fromCharCode(dtype);
            //console_log("!>>" + (off - 1).toString() + " : " + cdtype);
            if (cdtype == 'V') {
                _vcnt = dv.getInt32(off, true); off += 4;
                //console_log("!>>vc " + modelGL.vcnt.toString());
                for (var vc = 0; vc < _vcnt; vc++) {
                    model.verts.push(
                        dv.getFloat32(off, true),
                        dv.getFloat32(off + 4, true),
                        dv.getFloat32(off + 8, true)
                    ); off += 12;
                    model.norms.push(
                        dv.getFloat32(off, true),
                        dv.getFloat32(off + 4, true),
                        dv.getFloat32(off + 8, true)
                    ); off += 12;
                }
            }
            else if (cdtype == 'F') {
                _tcnt = dv.getInt32(off, true); off += 4;
                //console_log("!>>tc " + modelGL.tcnt.toString());
                for (var tc = 0; tc < _tcnt; tc++) {
                    off += 1; //material id
                    model.tris.push(
                        dv.getInt32(off, true),
                        dv.getInt32(off + 4, true),
                        dv.getInt32(off + 8, true)
                    ); off += 12;
                }
            }
            else if (cdtype == 'U') {
                var ucnt = dv.getInt8(off, true); off += 1;
                for (var vc = 0; vc < _vcnt; vc++) {
                    model.uvs.push(
                        dv.getFloat32(off, true),
                        1.0 - dv.getFloat32(off + 4, true)
                    ); off += 8;
                }
                if (ucnt > 1) {
                    off += 8 * _vcnt;//secondary uv
                }
            }
            else if (cdtype == 'G') {
                var gcnt = dv.getInt8(off, true); off += 1;
                //console_log("!>>gc " + gcnt.toString());
                while (gcnt > 0) {
                    const gnm = readString(new DataView(bstrm, off, 50));
                    model.allGrpNms.push(gnm);
                    gcnt -= 1;
                    off += gnm.length + 1;
                    //console_log("!>>grp " + gnm);
                }
                for (var vc = 0; vc < _vcnt; vc++) {
                    var gws = [];
                    gcnt = dv.getInt8(off, true); off += 1;
                    while (gcnt > 0) {
                        var gw = createModelGroupWeightSt();
                        gw.id = dv.getUint8(off, true); off += 1;
                        gw.val = dv.getFloat32(off, true); off += 4;
                        gws.push(gw);
                        gcnt -= 1;
                    }
                    model.allGrpWts.push(gws);
                }
            }
            else if (cdtype == 'S') {
                var scnt = dv.getInt8(off, true); off += 1;
                for (let si = 0; si < scnt; si++) {
                    const snm = readString(new DataView(bstrm, off, 50));
                    model.shapeNms.push(snm);
                    off += snm.length + 1;
                    //console_log("!>>shp " + snm);
                    
                    model.shapes.push([]);
                    var ss = model.shapes[si];
                    for (var vc = 0; vc < _vcnt; vc++) {
                        ss.push(
                            dv.getFloat32(off, true),
                            dv.getFloat32(off + 4, true),
                            dv.getFloat32(off + 8, true)
                        ); off += 12;
                    }
                }
            }
            else {
                console.error("cmesh loader: unknown char " + dtype.toString());
                break;
            }
            if (off == dv.byteLength) break;
            dtype = dv.getInt8(off, true); off += 1;
        }
        
        modelGL = genModelBuffers(gl, model);
        modelGL.loaded = true;
        console_log("loaded " + path + " (" + _vcnt + "v, " + _tcnt + "t)");
        onload(modelGL);
    });
}