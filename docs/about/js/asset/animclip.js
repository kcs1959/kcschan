function createAnimClipKey() {
    return {
        name : "",
        type : 0,
        dim : 3,
        frames : [],
        val : null
    };
}

function createAnimClip(nm = "unnamed") {
    return {
        name : nm,
        keys : [],
        frameStart : 0,
        frameEnd : 10,

        setTime : function(t) {

        }
    };
}