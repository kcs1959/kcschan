function createScene() {
    return {
        objects : [],
        
        findByNm : function(nm) {
            for (let o of this.objects) {
                const res = o.findByNm(nm);
                if (res != null) return res;
            }
            return null;
        },
        tree : function() {
            var dotree = function(s, oo, fl) {
                const brown = '<span style="color: #804000">';
                const red = '<span style="color: #ff0000">';
                const green = '<span style="color: #003000">';
                const blue = '<span style="color: #0000ff">';
                const endcol = '</span>';

                const sz = oo.length;
                if (!sz) return s;
                var fl2 = fl.slice();
                fl2.push(true);
                for (let a = 0; a < sz; a++) {
                    const o = oo[a];
                    fl.forEach(function(l) {
                        s += l ? "|\xa0" : "\xa0\xa0";
                    });
                    s += (a == sz - 1) ? "`-" : "+-";
                    s += o.name + brown + " [";
                    o.components.forEach(function(c) {
                        s += " " + c.name + ",";
                    });
                    if (s.slice(-1) != '[') {
                        s = s.slice(0, -1) + " ";
                    }
                    s += "]" + endcol + " "
                        + red + vec3_tostring(o.position) + endcol + " "
                        + green + quat_tostring(o.rotation) + endcol + " "
                        + blue + vec3_tostring(o.scale) + endcol
                        + "\n";
                    if (a == sz - 1)
                        fl2[fl2.length-1] = false;
                    s = dotree(s, o.childObjs, fl2);
                }
                return s;
            }

            var res = "Scene Tree\n";
            res = dotree(res, this.objects, []);
            return res;
        }
    }
}

var activeScene = createScene();