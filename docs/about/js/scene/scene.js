function createScene() {
    return {
        objects : [],
        
        tree : function() {
            var dotree = function(s, oo, fl) {
                const sz = oo.length;
                if (!sz) return s;
                var fl2 = fl.slice();
                fl2.push(true);
                for (let a = 0; a < sz; a++) {
                    fl.forEach(function(l) {
                        s += l ? "|\xa0\xa0" : "\xa0\xa0\xa0";
                    });
                    s += (a == sz - 1) ? "`--" : "+--";
                    s += oo[a].name + " [";
                    //for (auto& c : objs[a]->components()) {
                    //    s += " " + c->name() + ",";
                    //}
                    //if (s.back() != '[') {
                    //    s.back() = ' ';
                    //}
                    s += "]\n";
                    if (a == sz - 1)
                        fl2[fl2.length-1] = false;
                    s = dotree(s, oo[a].childObjs, fl2);
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