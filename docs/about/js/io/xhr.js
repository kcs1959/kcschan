function loadString(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.responseType = "text";
    xhr.onload = function() {
        callback(xhr.responseText);
    };
    xhr.send();
}

function loadBinary(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        callback(xhr.response);
    }
    xhr.send();
}