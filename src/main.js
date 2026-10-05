import { generateRandomArray } from './utils/arrays.js';
import { createBarRenderer } from './render/barRenderer.js';

const INITIAL_SIZE = 50;

const canvas = document.getElementById('canvas');
const renderer = createBarRenderer(canvas);
const values = generateRandomArray(INITIAL_SIZE);

function redraw() {
  renderer.resize();
  renderer.render(values);
}

window.addEventListener('resize', redraw);
redraw();