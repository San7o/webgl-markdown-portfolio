import { Canvas } from './canvas';
import { Buffer } from './buffer';
import { Shader } from './shader';

export module Renderer {
  export function render() {
    const canvas: HTMLCanvasElement = Canvas.get_canvas()!;
    if (canvas == null) {
      console.error('Unable to get canvas');
      return;
    }
    const gl: WebGLRenderingContext = Canvas.get_context(canvas)!;
    if (gl == null) {
      console.error('Unable to get WebGL context');
      return;
    }

    // vertex sharer
    const vsSource = `
      attribute vec4 aVertexPosition;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      }
    `;
    // fragment shader
    const fsSource = `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `;

    const shaderProgram: WebGLProgram = Shader.init(gl, vsSource, fsSource)!;
    if (shaderProgram == null) {
      console.error('Unable to initialize shader program');
      return;
    }

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          'uProjectionMatrix'
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          'uModelViewMatrix'
        ),
      },
    };

    const positions: Float32Array = new Float32Array([
      1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0,
    ]);

    const positionBuffer: WebGLBuffer = Buffer.init(gl)!;
    if (positionBuffer == null) {
      console.error('Unable to initialize buffer');
      return;
    }
    Buffer.bind(gl, positionBuffer);
    Buffer.data(gl, positions, gl.STATIC_DRAW);

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}
