const MIN_SIZE = 5;
const MAX_SIZE = 500;
const MIN_VALUE = 5;
const MAX_VALUE = 100;

export function generateRandomArray(size) {
  if (!Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
    throw new RangeError(`Size must be an integer between ${MIN_SIZE} and ${MAX_SIZE}.`);
  }
  return Array.from({ length: size }, () =>
    MIN_VALUE + Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)));
}