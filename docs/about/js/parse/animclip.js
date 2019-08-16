function loadAnimClip(gl, path, onload = null) {
    const anim = createAnimClip(path);
    loadBinary(path, function(bstrm) {
        var off = 0;
        
        var decoder = new TextDecoder();
        const sig = decoder.decode(new DataView(bstrm, 0, 4));
        if (sig != "ANIM") {
            console.log('unexpected animclip signature:"' + sig + '"');
            return;
        }
        off += 4;
        var dv = new DataView(bstrm);
        var kcnt = dv.getUint16(off, true); off += 2;
        anim.frameStart = dv.getUint16(off, true); off += 2;
        anim.frameEnd = dv.getUint16(off, true); off += 2;

        for (let i = 0; i < kcnt; i++) {
            var ky = createAnimClipKey();
            ky.type = dv.getUint8(off, true); off += 1;
            ky.name = readString(new DataView(bstrm, off, 100));
            off += ky.name.length + 1;
            off ++; //lerp
            var fc = dv.getUint16(off, true); off += 2;
            if (ky.type == 0x11) ky.dim = 4;
            
            for (let a = 0; a < fc; a++) {
                var f = dv.getUint32(off, true); off += 4;
                var vls = [];
                for (let d = 0; d < ky.dim; d++) {
                    vls.push(dv.getFloat32(off, true)); off += 4;
                }
                ky.frames.push([ f, vls ]);
            }
            anim.keys.push(ky);
        }
        if (onload)
            onload();
    });
    return anim;
}