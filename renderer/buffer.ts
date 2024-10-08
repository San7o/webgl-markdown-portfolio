export module Buffer {
  export function init(gl: WebGLRenderingContext): WebGLBuffer | null {
    const buffer: WebGLBuffer = gl.createBuffer()!;
    if (buffer == null) {
      console.error('Unable to create buffer');
      return null;
    }
    return buffer;
  }

  export function bind(gl: WebGLRenderingContext, buffer: WebGLBuffer): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  }

  export function unbind(gl: WebGLRenderingContext): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  export function data(
    gl: WebGLRenderingContext,
    data: Float32Array,
    usage: GLenum
  ): void {
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  }
}
