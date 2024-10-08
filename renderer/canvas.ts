import { Shader } from "./shader";

export module Canvas {

  export function get_canvas(): HTMLCanvasElement | null {
    const canvas = <HTMLCanvasElement> document.querySelector("#glcanvas");
    if (canvas == null) {
      console.error("Unable to find canvas element with id 'glcanvas'");
      return null;
    }
    return canvas;
  }

  export function get_context(canvas: HTMLCanvasElement): WebGLRenderingContext | null {

    const gl: WebGLRenderingContext = canvas.getContext("webgl")!;
    if (gl == null) {
      console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
      return null;
    }

    return gl;
  }

}
