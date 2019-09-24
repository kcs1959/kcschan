function createFbo(gl, w, h, depth, type=gl.RGBA) {
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);   
}