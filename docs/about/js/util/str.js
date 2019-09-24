function splitLines(str) {
    return str.match(/[^\r\n]+/g);
}

function readString(strm) {
    var decoder = new TextDecoder();
    var s = decoder.decode(strm);
    const noff = s.indexOf('\0');
    return s.substr(0, noff);
}

function nextWord(str, off) {
    var s1 = str.indexOf(' ', off);
    var s2 = str.indexOf('\t', off);
    var s3 = str.indexOf('\n', off);
    const lm = str.length;
    if (s1 == -1) s1 = lm;
    if (s2 == -1) s2 = lm;
    if (s3 == -1) s3 = lm;
    const l = Math.min(s1, s2, s3) - off;
    return [str.substr(off, l), off + l + 1];
}

function nextWordTo(str, off, c) {
    const s = str.indexOf(c, off);
    const lm = str.length - off;
    if (s == -1) s = lm;
    const l = s - off;
    return [str.substr(off, l), off + l + 1];
}