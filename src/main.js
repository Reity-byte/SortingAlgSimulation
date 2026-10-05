import { generateRandomArray } from './utils/arrays.js';
import { createBarRenderer } from './render/barRenderer.js';
import { createPlayer, PlayerState } from './core/player.js';
import { EventType} from './core/events.js';
import { bubbleSort } from './algorithms/bubble.js';

const INITIAL_SIZE = 50;

const canvas = document.getElementById('canvas');
const playButton = document.getElementById('btn-play');
const stepButton = document.getElementById('btn-step');
const resetButton = document.getElementById('btn-reset');
const speedSlider = document.getElementById('speed');

const renderer = createBarRenderer(canvas);
const original = generateRandomArray(INITIAL_SIZE);

let values = [...original];
const sortedIndices = new Set();

function applyEvent(event)
{
    const highlights = new Map();
    sortedIndices.forEach((i) => highlights.set(i, '--color-sorted'));

    switch(event.type)
    {
        case EventType.COMPARE:
            event.indices.forEach((i) => highlights.set(i, '--color-compare'));
            break;
        case EventType.SWAP:
            const [a, b] = event.indices;
            [values[a], values[b]] = [values[b], values[a]];
            event.indices.forEach((i) => highlights.set(i, '--color-swap'));
            break;
        case EventType.SORTED:
            event.indices.forEach((i) => sortedIndices.add(i));
            event.indices.forEach((i) => highlights.set(i, '--color-sorted'));
            break;
        case EventType.DONE:
            break;
    }
    renderer.render(values, highlights);
}

function updateButtons(state)
{
    playButton.textContent = state === PlayerState.PLAYING ? 'pause' : 'play';
    const finished = state === PlayerState.FINISHED;
    playButton.disabled = finished;
    stepButton.disabled = finished || state === PlayerState.PLAYING;
}

const player = createPlayer
(
    () => bubbleSort([...original]),
    applyEvent,
    updateButtons,
);

function redraw() 
{
  renderer.resize();
  renderer.render(values);
}

function resetAll() {
  player.reset();
  values = [...original];
  sortedIndices.clear();
  redraw();
}

playButton.addEventListener('click', () =>
{
    if (player.getState() === PlayerState.PLAYING) player.pause();
    else player.play();
});

stepButton.addEventListener('click', () => player.step());
resetButton.addEventListener('click', resetAll);
speedSlider.addEventListener('input', () => player.setSpeed(Number(speedSlider.value)));

window.addEventListener('resize', redraw);
player.setSpeed(Number(speedSlider.value));
updateButtons(player.getState());
redraw();