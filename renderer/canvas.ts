export module Canvas {

  export function create(): void {
    const canvas = <HTMLCanvasElement> document.querySelector("#glcanvas");
    if (canvas == null) {
      alert("Unable to find canvas element with id 'glcanvas'");
      return
    }

    const gl = canvas.getContext("webgl");
    if (gl == null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    // vertex sharer
    const vsSource = `
      attribute vec4 aVertexPosition;
      uniform mat4 uModelviewMatrix;
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

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

}
