function renderScene() {
    var mrs = [];
    var smrs = [];

    var seek = function(oo) {
        oo.forEach(function(o) {
            o.components.forEach(function(c) {
                if (c.ctype == 1) {
                    mrs.push(c);
                }
                else if (c.ctype == 2) {
                    smrs.push(c);
                }
            });
        });
    }
    
}