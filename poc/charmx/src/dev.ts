import { startCharmx } from './charmx/server';
import { startDownstream } from './downstream/server';

/**
 * Runs both POC services in one process so the demo is a single command.
 * `npm run charmx` / `npm run downstream` start them separately.
 */
startDownstream();
startCharmx();
