function loadCMesh(gl, path, onload = null) {
    var model = createModelSt();
    var modelGL = genModelBuffers(gl, model);
    
    loadBinary(path, function(bstrm) {
        var off = 0;
        
        var decoder = new TextDecoder();
        const sig = decoder.decode(new DataView(bstrm, 0, 6));
        if (sig != "KTO123") {
            console.log('unexpected mesh signature:"' + sig + '"');
            return;
        }
        off += 6;
        const nm = readString(new DataView(bstrm, off, 50));
        off += nm.length + 1;
        
        var dv = new DataView(bstrm);
        var dtype = dv.getInt8(off, true); off += 1;
        
        while (dtype != 0) {
            const cdtype = String.fromCharCode(dtype);
            //console.log("!>>" + (off - 1).toString() + " : " + cdtype);
            if (cdtype == 'V') {
                modelGL.vcnt = dv.getInt32(off, true); off += 4;
                //console.log("!>>vc " + modelGL.vcnt.toString());
                for (var vc = 0; vc < modelGL.vcnt; vc++) {
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
                modelGL.tcnt = dv.getInt32(off, true); off += 4;
                //console.log("!>>tc " + modelGL.tcnt.toString());
                for (var tc = 0; tc < modelGL.tcnt; tc++) {
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
                for (var vc = 0; vc < modelGL.vcnt; vc++) {
                    model.uvs.push(
                        dv.getFloat32(off, true),
                        1.0 - dv.getFloat32(off + 4, true)
                    ); off += 8;
                }
                if (ucnt > 1) {
                    off += 8 * modelGL.vcnt;//secondary uv
                }
            }
            else if (cdtype == 'G') {
                var gcnt = dv.getInt8(off, true); off += 1;
                //console.log("!>>gc " + gcnt.toString());
                while (gcnt > 0) {
                    const gnm = readString(new DataView(bstrm, off, 50));
                    model.allGrpNms.push(gnm);
                    gcnt -= 1;
                    off += gnm.length + 1;
                    //console.log("!>>grp " + gnm);
                }
                for (var vc = 0; vc < modelGL.vcnt; vc++) {
                    var gws = [];
                    gcnt = dv.getInt8(off, true); off += 1;
                    while (gcnt > 0) {
                        var gw = createModelGroupWeightSt();
                        var gwid = dv.getUint8(off, true); off += 1;
                        var gwvl = dv.getFloat32(off, true); off += 4;
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
                    //console.log("!>>shp " + snm);
                    
                    model.shapes.push([]);
                    var ss = model.shapes[si];
                    for (var vc = 0; vc < modelGL.vcnt; vc++) {
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
        
        updateModelBuffers(gl, modelGL, model);
        modelGL.loaded = true;
        if (onload) {
            onload(modelGL);
        }
    });
    
    return modelGL;
}