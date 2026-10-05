import {EventType} from './events.js';

const DEFAULT_STEPS_PER_SECOND = 60;
const MS_PER_SECOND = 1000;

export const PlayerState = Object.freeze({
        IDLE: 'idle',
        PLAYING: 'playing',
        PAUSED: 'paused',
        FINISHED: 'finished',
});

export function createPlayer(generatorFactory, onEvent, onStateChange = () => {}) 
{
    let generator = null;
    let rafId = null;
    let lastTime = 0;
    let accumulator = 0;
    let stepsPerSecond = DEFAULT_STEPS_PER_SECOND;
    let state = PlayerState.IDLE;

    function setState(next)
    {
        if (state === next) return;
        state = next;
        onStateChange(state);
    }
    
    function cancelFrame()
    {
        if(rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
    }

    function stepOnce()
    {   
        generator ??= generatorFactory();
        const {value, done} = generator.next();
        if(done)
        {
            cancelFrame();
            setState(PlayerState.FINISHED);
            return false;
        }
        onEvent(value);
        if(value.type === EventType.DONE)
        {
            cancelFrame();
            setState(PlayerState.FINISHED);
            return false;
        }
        return true;
    }

    function tick(now)
    {
        accumulator += now - lastTime;
        lastTime = now;
        const stepDuration = MS_PER_SECOND / stepsPerSecond;
        while (accumulator >= stepDuration)
        {
            accumulator -= stepDuration;
            if(!stepOnce()) return;
        }
        rafId = requestAnimationFrame(tick);
    }

    function play()
    {
        if(state === PlayerState.PLAYING || state === PlayerState.FINISHED) return;
        lastTime = performance.now();
        accumulator = 0;
        setState(PlayerState.PLAYING);
        rafId = requestAnimationFrame(tick);    
    }

    function pause()
    {
        if (state !== PlayerState.PLAYING) return;
        cancelFrame();
        setState(PlayerState.PAUSED);
    }

    function step()
    {
        if( state === PlayerState.PLAYING || state === PlayerState.FINISHED) return;
        if (stepOnce()) setState(PlayerState.PAUSED);
    }

    function reset()
    {
        cancelFrame();
        generator = null;
        accumulator = 0;
        setState(PlayerState.IDLE);
    }

    function setSpeed(n)
    {
        if(!Number.isFinite(n) || n <= 0) return;
        stepsPerSecond = n;
    }

    return {play, pause, step, reset, setSpeed, getState: () => state };
}