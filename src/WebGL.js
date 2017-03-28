import { mat4 } from 'gl-matrix';

import Program from './Program';
import Geometry from './Geometry';
import Renderer from './Renderer';

let canvas = document.getElementById('webgl-canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

let renderer = new Renderer(glContext, canvas.width, canvas.height);

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

setPMatrix(window.innerWidth, window.innerHeight);
mat4.identity(mvMatrix);
mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);

program.setUniform('uMVMatrix', mvMatrix, '4fv');

function render() {
    renderer.setProgram(program);
    program.updateUniforms();
    tick();
}

function tick() {
    window.requestAnimationFrame(tick);
    renderer.render();
}

function setPMatrix(viewportWidth, viewportHeight) {
    mat4.perspective(pMatrix, 0.7853981634, viewportWidth / viewportHeight, 0.1, 100.0);     
    program.setUniform('uPMatrix', pMatrix, '4fv');      
}

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

window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    setPMatrix(canvas.width, canvas.height);
    renderer.setViewport(canvas.width, canvas.height);
};

render();