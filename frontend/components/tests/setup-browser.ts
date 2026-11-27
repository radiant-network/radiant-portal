import { setupWorker } from 'msw/browser';
import { afterAll, afterEach, beforeAll } from 'vitest';

import '@styles/theme.css';
import '@styles/tailwind.css';

export const worker = setupWorker();

beforeAll(async () => {
  await worker.start({ quiet: true, onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  worker.resetHandlers();
  sessionStorage.clear();
  localStorage.clear();
});

afterAll(() => {
  worker.stop();
});
