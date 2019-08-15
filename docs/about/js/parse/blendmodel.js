function _loadBlendEntry(gl, baseObj, allObjs, strs, i, fd, callback = null) {
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
            obj.position.x = +(wd);
            [wd, off] = nextWord(s, off);
            obj.position.y = +(wd);
            [wd, off] = nextWord(s, off);
            obj.position.z = +(wd);
        }
        else if (wd == "rot") {
            [wd, off] = nextWord(s, off);
            obj.rotation.w = +(wd);
            [wd, off] = nextWord(s, off);
            obj.rotation.x = +(wd);
            [wd, off] = nextWord(s, off);
            obj.rotation.y = +(wd);
            [wd, off] = nextWord(s, off);
            obj.rotation.z = +(wd);
        }
        else if (wd == "scl") {
            [wd, off] = nextWord(s, off);
            obj.scale.x = +(wd);
            [wd, off] = nextWord(s, off);
            obj.scale.y = +(wd);
            [wd, off] = nextWord(s, off);
            obj.scale.z = +(wd);
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
    }
    else {
        baseObj.addChild(obj);
    }
    allObjs.push(obj);
    if (isarm) {
        loadArmature(gl, fd + obj.name + ".arma.meta", obj, () =>
            _loadBlendEntry(gl, baseObj, allObjs, strs, i+1, fd, callback)
        );
    }
    else {
        //loadMeshMeta(fd + obj.name + ".mesh.meta", obj, () =>
            _loadBlendEntry(gl, baseObj, allObjs, strs, i+1, fd, callback);
        //);
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
            document.querySelector("#debug_scenetree").innerHTML = activeScene.tree();
        });
    });
}