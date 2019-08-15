function splitLines(str) {
    return str.match(/[^\r\n]+/g);
}

function readString(strm) {
    var decoder = new TextDecoder();
    var s = decoder.decode(strm);
    const noff = s.indexOf('\0');
    return s.substr(0, noff);
}