function createTextureSt(gl, tex, w, h, fmt, type) {
    return {
        tex : tex,
        w : 0,
        h : 0,
        fmt : gl.RGBA,
        type : gl.UNSIGNED_BYTE,
        bind : function(loc, slot) {
            gl.uniform1i(loc, slot);
            gl.activeTexture(gl.TEXTURE0 + slot);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
        }
    };
}

function createTexture(gl, path, callback=null, fmt=gl.RGBA, type=gl.UNSIGNED_BYTE) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const pixel = new Uint8Array([255, 0, 0, 255])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    const img = new Image();
    img.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, type, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        tex.w = img.width;
        tex.h = img.height;
        tex.fmt = fmt;
        tex.type = tex.type;
        if (callback) {
            callback();
        }
    }
    img.onerror = function() {
        console.log('Cannot load image ' + path + '!');
    }
    img.src = path;

    return createTextureSt(gl, tex, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE);
}

function createBufTexture(gl, data, fmt=gl.RGBA, type=gl.FLOAT) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const h = (data.length + 1023) / 1024;
    const w = data.length - (h - 1) * 1024;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, w, h, 0, fmt, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return createTextureSt(gl, tex, w, h, fmt, type);
}

function createDataTexture(gl, data, w, h, fmt, type) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, w, h, 0, fmt, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return createTextureSt(gl, tex, w, h, fmt, type);
}

function createEmptyTexture(gl, w, h, fmt) {
    const tex = gl.createTexture();
    const data = new Uint8Array(w * h * 16);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, w, h, 0, fmt, gl.UNSIGNED_BYTE, data);
    return createTextureSt(gl, tex, w, h, fmt, gl.UNSIGNED_BYTE);
}

function updateTexture(gl, tex, data) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, tex.w, tex.h, tex.fmt, tex.type, data);
}