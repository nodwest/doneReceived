import { useSyncExternalStore } from 'react';

let generation = 0;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getGeneration = () => generation;

export const usePrivateImageGeneration = () =>
  useSyncExternalStore(subscribe, getGeneration, getGeneration);

export function invalidatePrivateImageGeneration() {
  generation += 1;
  for (const listener of listeners) listener();
}
