import {EventType} from '../core/events.js';

export function* bubbleSort(array) 
{
  const n = array.length;
  let end = n;
  for(let i = 0; i < n - 1; i++) 
  {
    let swapped = false;
    for(let j = 0; j < n - i - 1; j++) {
        yield { type: EventType.COMPARE, indices: [j, j + 1] };
         if (array[j] > array[j + 1]) 
        {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        yield { type: EventType.SWAP, indices: [j, j + 1] };
      }
    }
    --end;

    yield {type : EventType.SORTED, indices: [end]};
    if(!swapped) break;
  }
  if (end > 0)
  {
    yield {type: EventType.SORTED, indices: Array.from({length: end }, (_, k) => k) };
  }
  yield {type: EventType.DONE};
}