export module Shader {

  export function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | null {
    const shader: WebGLShader = gl.createShader(type)!;
    if (shader == null) {
      console.error("Unable to create shader");
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  export function init(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
    const vertexShader: WebGLShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
    const fragmentShader: WebGLShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;
    if (vertexShader == null || fragmentShader == null) {
      console.error("Unable to load shaders");
      return null;
    }

    const shaderProgram: WebGLProgram = gl.createProgram()!;
    if (shaderProgram == null) {
      console.error("Unable to create shader program");
      return null;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }
}
