import { mat4 } from 'gl-matrix';

import Program from './Program';
import Geometry from './Geometry';
import Renderer from './Renderer';

let canvas = document.getElementById('webgl-canvas');
let glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
let viewportWidth = canvas.width;
let viewportHeight = canvas.height;

let renderer = new Renderer(glContext, viewportWidth, viewportHeight);

let program = new Program(glContext);
program.setVertexShader('shader-vs');
program.setFragmentShader('shader-fs');

let geometry = new Geometry(glContext);
let vertices = [
    0.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
];
let color = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
];
geometry.addAttribute('vertexPosition', new Float32Array(vertices), 3);
geometry.addAttribute('vertexColor', new Float32Array(color), 4);
renderer.setGeometry(geometry);

let mvMatrix = mat4.create();
let pMatrix = mat4.create();

mat4.perspective(pMatrix, 0.7853981634, viewportWidth / viewportHeight, 0.1, 100.0);
mat4.identity(mvMatrix);
mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);

program.setUniform('uMVMatrix', mvMatrix, '4fv');
program.setUniform('uPMatrix', pMatrix, '4fv');

document.onkeydown = function(e) {
    switch (e.keyCode) {
    case 37:
        mat4.translate(mvMatrix, mvMatrix, [-0.05, 0.0, 0.0]);
        break;
    case 38:
        mat4.translate(mvMatrix, mvMatrix, [0.0, 0.05, 0.0]);
        break;
    case 39:
        mat4.translate(mvMatrix, mvMatrix, [0.05, 0.0, 0.0]);
        break;  
    case 40:
        mat4.translate(mvMatrix, mvMatrix, [0.0, -0.05, 0.0]);
        break;
    case 221:
        mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, 0.05]);
        break;
    case 219:
        mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -0.05]);
        break;
    }
};

function render() {
    renderer.setProgram(program);
    program.updateUniforms();
    tick();
}

function tick() {
    window.requestAnimationFrame(tick);
    renderer.render();
}

render();