function loadArmatureBone(gl, bstrm, dv, off, arm, po) {
    var wd = "";
    var decoder = new TextDecoder();
    const swd = decoder.decode(new DataView(bstrm, off, 30));
    var toff = 0;
    [wd, toff] = nextWordTo(swd, toff, '\0');
    const bn = createArmatureBone(wd);
    [wd, toff] = nextWordTo(swd, toff, '\0');
    off += toff;
    if (wd != "") {
        bn.parentBn = arm.bones.find(function(b) {
            return b.name == wd;
        });
        bn.fullName = bn.parentBn.fullName + "/" + bn.name;
    }
    var pos = vec3.fromValues(
        dv.getFloat32(off, true),
        dv.getFloat32(off + 4, true),
        dv.getFloat32(off + 8, true)
    ); off += 12;
    var tal = vec3.fromValues(
        dv.getFloat32(off, true),
        dv.getFloat32(off + 4, true),
        dv.getFloat32(off + 8, true)
    ); off += 12;
    var fwd = vec3.fromValues(
        dv.getFloat32(off, true),
        dv.getFloat32(off + 4, true),
        dv.getFloat32(off + 8, true)
    ); off += 12;
    var rot = quat_lookAt(vec3_minus(tal, pos), fwd);
    off += 1; //mask

    arm.bones.push(bn);
    bn.object = createSceneObject(bn.name);
    if (bn.parentBn) {
        bn.parentBn.object.addChild(bn.object);
    }
    else {
        po.addChild(bn.object);
    }

    dtype = dv.getInt8(off, true);
    cdtype = String.fromCharCode(dtype);
    off += 1;
    if (cdtype != "b") {
        debug.error("expected closing char here!");
    }
    return off;
}

function loadArmature(gl, path, obj, onload = null) {
    loadBinary(path, function(bstrm) {
        var off = 0;
        
        var decoder = new TextDecoder();
        const sig = decoder.decode(new DataView(bstrm, 0, 3));
        if (sig != "ARM") {
            console.log('unexpected armature signature:"' + sig + '"');
            return;
        }
        off += 4;
        var dv = new DataView(bstrm);
        var dtype = dv.getInt8(off, true);
        var cdtype = String.fromCharCode(dtype);
        off += 1;

        var arm = createArmature();
        obj.components.push(arm);

        const mxlen = dv.byteLength;

        while (cdtype == "B") {
            off = loadArmatureBone(gl, bstrm, dv, off, arm, obj);
            if (off >= mxlen) break;
            dtype = dv.getInt8(off, true);
            cdtype = String.fromCharCode(dtype);
            off += 1;
        }
        if (onload)
            onload();
    });
}