# webgl-markdown-portfolio

This repo contains a static website created in Angular
with a basic 3D renderer using **WebGL** as a portfolio
to my projects. Blog posts will be automatically generated
from markdown using templates via a **Rust** program [here](https://github.com/San7o/rust-ag-blog).

The project is currently in early development.

The renderer uses [glMatrix](https://glmatrix.net/) for matrix computations, follow the build instructions in the github to build the library for your own projects.

## usage
Serve:
```bash
npx ng serve
```
Create a component:
```bash
npx ng g c myComponent
```
