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
    const colorBuffer: WebGLBuffer = gl.createBuffer()!;
    if (colorBuffer == null) {
      console.error('Unable to create buffer');
      return null;
    }

    const faceColors: number[][] = [
      [1.0, 1.0, 1.0, 1.0], // Front face: white
      [1.0, 0.0, 0.0, 1.0], // Back face: red
      [0.0, 1.0, 0.0, 1.0], // Top face: green
      [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
      [1.0, 1.0, 0.0, 1.0], // Right face: yellow
      [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];

    var colors: number[] = [];

    for (var j = 0; j < faceColors.length; ++j) {
      const c: number[] = faceColors[j];
      colors = colors.concat(c, c, c, c);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return colorBuffer;
  }

  export function initIndexBuffer(
    gl: WebGLRenderingContext
  ): WebGLBuffer | null {
    const indexBuffer: WebGLBuffer = gl.createBuffer()!;
    if (indexBuffer == null) {
      console.error('Unable to create buffer');
      return null;
    }

    const indices: Uint16Array = new Uint16Array([
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ]);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return indexBuffer;
  }
}
