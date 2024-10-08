export module Buffer {
  export function initArrayBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const buffer: WebGLBuffer = gl.createBuffer()!;
    if (buffer == null) {
      console.error('Unable to create buffer');
      return null;
    }
    return buffer;
  }

  export function data(
    gl: WebGLRenderingContext,
    data: Float32Array,
    usage: GLenum
  ): void {
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  }

  export function initColorBuffer(
    gl: WebGLRenderingContext
  ): WebGLBuffer | null {
    const buffer: WebGLBuffer = gl.createBuffer()!;
    if (buffer == null) {
      console.error('Unable to create buffer');
      return null;
    }

    const colors: Float32Array = new Float32Array([
      1.0,
      1.0,
      1.0,
      1.0, // white
      1.0,
      0.0,
      0.0,
      1.0, // red
      0.0,
      1.0,
      0.0,
      1.0, // green
      0.0,
      0.0,
      1.0,
      1.0, // blue
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    return buffer;
  }
}
