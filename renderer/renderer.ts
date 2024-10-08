import { Canvas } from './canvas';
import { Buffer } from './buffer';
import { Shader } from './shader';
import { mat4 } from 'gl-matrix';

export module Renderer {
  type ProgramInfo = {
    program: WebGLProgram;
    attribLocations: {
      vertexPosition: number;
      vertexColor: number;
    };
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation;
      modelViewMatrix: WebGLUniformLocation;
    };
  };

  type GlBuffers = {
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
  };
  export function render(): void {
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
      attribute vec4 aVertexColor;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      varying lowp vec4 vColor;
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
      }
    `;
    // fragment shader
    const fsSource = `
      varying lowp vec4 vColor;

      void main() {
        gl_FragColor = vColor;
      }
    `;

    const shaderProgram: WebGLProgram = Shader.init(gl, vsSource, fsSource)!;
    if (shaderProgram == null) {
      console.error('Unable to initialize shader program');
      return;
    }

    const programInfo: ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          'uProjectionMatrix'
        )!,
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          'uModelViewMatrix'
        )!,
      },
    };

    const positions: Float32Array = new Float32Array([
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ]);


    const positionBuffer: WebGLBuffer = Buffer.initArrayBuffer(gl)!;
    if (positionBuffer == null) {
      console.error('Unable to initialize buffer');
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    Buffer.data(gl, positions, gl.STATIC_DRAW);

    const colorBuffer: WebGLBuffer = Buffer.initColorBuffer(gl)!;
    if (colorBuffer == null) {
      console.error('Unable to initialize color buffer');
      return;
    }

    const indexBuffer: WebGLBuffer = Buffer.initIndexBuffer(gl)!;
    if (indexBuffer == null) {
      console.error('Unable to initialize index buffer');
      return;
    }

    const buffers = {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer,
    };


    let cubeRotation: number = 0.0;
    let deltaTime: number = 0.0; // TODO: move to time module
    let then: number = 0.0;

    function render(now: number): void {
      now *= 0.001;
      deltaTime = now - then;
      then = now;

      draw(gl, programInfo, buffers, cubeRotation);
      cubeRotation += deltaTime;
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  function draw(
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffers: GlBuffers,
    cubeRotation: number
  ): void {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // camera settings
    const fieldOfView: number = (45 * Math.PI) / 180;
    const aspect: number =
      (<HTMLCanvasElement>gl.canvas).clientWidth /
      (<HTMLCanvasElement>gl.canvas).clientHeight;
    const zNear: number = 0.1;
    const zFar: number = 100.0;
    const projectionMatrix = mat4.create();

    // transform
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [1, 0, 0]);

    // vertex position
    {
      const numComponents: number = 3;
      const type: GLenum = gl.FLOAT;
      const normalize: boolean = false;
      const stride: number = 0;
      const offset: number = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // vertex color
    {
      const numComponents: number = 4;
      const type: GLenum = gl.FLOAT;
      const normalize: boolean = false;
      const stride: number = 0;
      const offset: number = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // set uniforms
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

    // draw call
    const vertexCount: number = 36;
    const type: GLenum = gl.UNSIGNED_SHORT;
    const offset: number = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}
