function registerMeshNm(gl, obj) {
    const nms = obj.name.split('_');
    if (nms[0] == 'clth') {
        const i = portrait_clothes_list.indexOf(nms[1]);
        if (i == -1) {
            portrait_clothes_list.push(nms[1]);
            portrait_clothes_objs.push([obj]);
            if (portrait_clothes_list.length != portrait_clothes_id + 1) {
                obj.enabled = false;
            }
        }
        else {
            portrait_clothes_objs[i].push(obj);
            if (i != portrait_clothes_id) {
                obj.enabled = false;
            }
        }
    }
    return (nms.length > 1) ? nms[1] : nms[0];
}

function loadMeshMeta(gl, path, fd, obj, callback) {
    loadCMesh(gl, path, function(mesh) {
        const mr = createMeshRenderer();
        obj.addComponent(mr);
        mr.mesh = mesh;
        const nm = registerMeshNm(gl, obj);
        mr.tex = createTexture(gl, fd + nm + ".jpg", callback);
    });
}

function loadSkinnedMeshMeta(gl, path, fd, obj, arm, callback) {
    loadCMesh(gl, path, function(mesh) {
        const mr = createSkinnedMeshRenderer();
        obj.addComponent(mr);
        mr.mesh = mesh;
        mr.arma = obj.parentObj.findByNm(arm).components[0];
        const nm = registerMeshNm(gl, obj);
        mr.tex = createTexture(gl, fd + nm + ".jpg", callback);
    });
}

function _loadBlendEntry(gl, baseObj, allObjs, strs, i, fd, callback) {
    if (i == strs.length) {
        if (callback)
            callback();
        return;
    }
    const s = strs[i];
    
    var wd = "";
    var off = 0;
    const slen = s.length;
    [wd, off] = nextWord(s, off);
    const isarm = (wd == "arm");
    [wd, off] = nextWord(s, off);
    const obj = createSceneObject(wd);
    var partp = 0;
    var pnm = "";
    while (off < slen) {
        off += 1; //null character
        [wd, off] = nextWord(s, off);
        if (wd == "prt") {
            if (obj.name.slice(-1) == "\1") {
                partp = 2;
                obj.name = obj.name.slice(0, -1);
            }
            else  {
                partp = 1;
            }
            [pnm, off] = nextWord(s, off);
        }
        else if (wd == "pos") {
            [wd, off] = nextWord(s, off);
            obj.position[0] = +(wd);
            [wd, off] = nextWord(s, off);
            obj.position[1] = +(wd);
            [wd, off] = nextWord(s, off);
            obj.position[2] = +(wd);
        }
        else if (wd == "rot") {
            [wd, off] = nextWord(s, off);
            obj.rotation[3] = +(wd);
            [wd, off] = nextWord(s, off);
            obj.rotation[0] = +(wd);
            [wd, off] = nextWord(s, off);
            obj.rotation[1] = +(wd);
            [wd, off] = nextWord(s, off);
            obj.rotation[2] = +(wd);
        }
        else if (wd == "scl") {
            [wd, off] = nextWord(s, off);
            obj.scale[0] = +(wd);
            [wd, off] = nextWord(s, off);
            obj.scale[1] = +(wd);
            [wd, off] = nextWord(s, off);
            obj.scale[2] = +(wd);
            break;
        }
        else break;
    }
    if (partp == 1) {
        var ss = pnm.split("\2");
        if (ss.length == 1) {
            baseObj.findByNm(ss[0]).addChild(obj);
        }
        else {
            baseObj.findByNm(ss[0]).findByNm(ss[1]).addChild(obj);
        }
        obj.setWorldPos(obj.position);
        obj.setWorldRot(obj.rotation);
    }
    else {
        baseObj.addChild(obj);
    }
    allObjs.push(obj);
    obj.updateMatrices();
    if (isarm) {
        loadArmature(gl, fd + obj.name + ".arma.meta", obj, () =>
            _loadBlendEntry(gl, baseObj, allObjs, strs, i+1, fd, callback)
        );
    }
    else if (partp == 2) {
        loadSkinnedMeshMeta(gl, fd + obj.name + ".mesh.meta", fd, obj, pnm, () =>
            _loadBlendEntry(gl, baseObj, allObjs, strs, i+1, fd, callback)
        );
    }
    else {
        loadMeshMeta(gl, fd + obj.name + ".mesh.meta", fd, obj, () =>
            _loadBlendEntry(gl, baseObj, allObjs, strs, i+1, fd, callback)
        );
    }
}

function loadBlend(gl, name) {
    const path = name + ".blend.bin";
    const fd = name + "_blend/";
    loadString(path, function(str) {
        var strs = splitLines(str);
        if (strs[0] != "KTM123") {
            console.log('unexpected model signature:"' + strs[0] + '"');
            return;
        }
        
        var baseObj = createSceneObject(name);
        var allObjs = [];
        
        _loadBlendEntry(gl, baseObj, allObjs, strs, 1, fd, function() {
            activeScene.objects.push(baseObj);
            var clths = "";
            portrait_clothes_list.forEach(function(s, i) {
                clths += "<input type='radio' name='clth' onclick='portrait_clothes_id=" + i.toString() + ((!i) ? "' checked>" : "'>") + s + "<br/>";
            });
            document.querySelector("#clothes_list").innerHTML = clths;
            document.querySelector("#debug_scenetree").innerHTML = activeScene.tree();
        });
    });
}