function loadArmatureBone(gl, bstrm, dv, off, arm, po, im0) {
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
        bn.fullName = bn.parentBn.fullName + bn.name + "/";
    }
    else {
        bn.fullName = bn.name + "/";
    }
    const pos = vec3.fromValues(
        dv.getFloat32(off, true),
        dv.getFloat32(off + 4, true),
        dv.getFloat32(off + 8, true)
    ); off += 12;
    const tal = vec3.fromValues(
        dv.getFloat32(off, true),
        dv.getFloat32(off + 4, true),
        dv.getFloat32(off + 8, true)
    ); off += 12;
    const fwd = vec3.fromValues(
        dv.getFloat32(off, true),
        dv.getFloat32(off + 4, true),
        dv.getFloat32(off + 8, true)
    ); off += 12;
    const dir = vec3_minus(tal, pos);
    const rot = quat_lookAt(dir, fwd);
    off += 1; //mask

    arm.bones.push(bn);
    bn.length = vec3.length(dir);
    bn.object = createSceneObject(bn.name);
    bn.object.position = pos;
    bn.object.rotation = rot;
    if (bn.parentBn) {
        bn.parentBn.object.addChild(bn.object);
        vec3.add(bn.object.position, bn.object.position, vec3.fromValues(0, 0, bn.parentBn.length));
    }
    else {
        po.addChild(bn.object);
    }
    bn.object.updateMatrices();
    mat4.mul(bn.irestMat, im0, bn.object.worldMatrix);

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
            console_log('unexpected armature signature:"' + sig + '"');
            return;
        }
        off += 4;
        var dv = new DataView(bstrm);
        var dtype = dv.getInt8(off, true);
        var cdtype = String.fromCharCode(dtype);
        off += 1;

        var arm = createArmature();
        obj.addComponent(arm);

        const mxlen = dv.byteLength;

        var im = mat4.create();
        mat4.invert(im, obj.worldMatrix);

        while (cdtype == "B") {
            off = loadArmatureBone(gl, bstrm, dv, off, arm, obj, im);
            if (off >= mxlen) break;
            dtype = dv.getInt8(off, true);
            cdtype = String.fromCharCode(dtype);
            off += 1;
        }
        preupdate_comps.push(arm);
        if (onload)
            onload();
    });
}