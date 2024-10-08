import { Canvas } from './canvas';
import { Buffer } from './buffer';
import { Shader } from './shader';
import { mat4 } from 'gl-matrix';

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

    // do the render -----------------------------

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView: number = (45 * Math.PI) / 180;
    const aspect: number = (<HTMLCanvasElement> gl.canvas).clientWidth / (<HTMLCanvasElement> gl.canvas).clientHeight;
    const zNear: number = 0.1;
    const zFar: number = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
