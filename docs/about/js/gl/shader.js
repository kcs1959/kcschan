function createShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('Error compiling shader: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgramSt(gl) {
    return {
        loaded : false,
        pointer : null,
        uniforms : [],
        bind : function() {
            if (this.loaded) {
                gl.useProgram(this.pointer);
            }
        }
    };
}

function createTFProgram(gl, vs, fs, onms, vrs) {
    var res = {
        loaded : false,
        pointer : null,
        uniforms : [],
        bind : function(outs) {
            if (this.loaded) {
                gl.useProgram(this.pointer);
                var a = 0;
                outs.forEach(function (o) {
                    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, a, o);
                    a += 1;
                });
            }
        },
        execA : function(n) {
            gl.enable(gl.RASTERIZER_DISCARD);
            gl.beginTransformFeedback(gl.POINTS);
            gl.drawArrays(gl.POINTS, 0, n);
            gl.endTransformFeedback();
            gl.disable(gl.RASTERIZER_DISCARD);
        },
        execE : function(n, tp = gl.UNSIGNED_SHORT) {
            gl.enable(gl.RASTERIZER_DISCARD);
            gl.beginTransformFeedback(gl.POINTS);
            gl.drawElements(gl.POINTS, n, tp, 0);
            gl.endTransformFeedback();
            gl.disable(gl.RASTERIZER_DISCARD);
        }
    };
    
    loadString(vs, function(vss) {
        loadString(fs, function(fss) {
            const vsh = createShader(gl, gl.VERTEX_SHADER, vss);
            const fsh = createShader(gl, gl.FRAGMENT_SHADER, fss);
            
            const prog = gl.createProgram();
            gl.attachShader(prog, vsh);
            gl.attachShader(prog, fsh);
            gl.transformFeedbackVaryings(prog, onms, gl.SEPARATE_ATTRIBS);
            gl.linkProgram(prog);
            gl.detachShader(prog, vsh);
            gl.detachShader(prog, fsh);
            gl.deleteShader(vsh);
            gl.deleteShader(fsh);

            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.log('Error linking program: ' + gl.getProgramInfoLog(prog));
                return null;
            }

            res.pointer = prog;
            vrs.forEach(function (v) {
                res.uniforms.push(gl.getUniformLocation(prog, v));
            });
            
            res.loaded = true;
        });
    });

    return res;
}

function createProgram(gl, vs, fs, vrs) {
    var res = createProgramSt(gl);
    
    loadString(vs, function(vss) {
        loadString(fs, function(fss) {
            const vsh = createShader(gl, gl.VERTEX_SHADER, vss);
            const fsh = createShader(gl, gl.FRAGMENT_SHADER, fss);
            
            const prog = gl.createProgram();
            gl.attachShader(prog, vsh);
            gl.attachShader(prog, fsh);
            gl.linkProgram(prog);
            gl.detachShader(prog, vsh);
            gl.detachShader(prog, fsh);
            gl.deleteShader(vsh);
            gl.deleteShader(fsh);

            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.log('Error linking program: ' + gl.getProgramInfoLog(prog));
                return null;
            }

            res.pointer = prog;
            vrs.forEach(function (v) {
                res.uniforms.push(gl.getUniformLocation(prog, v));
            });
            
            res.loaded = true;
        });
    });

    return res;
}