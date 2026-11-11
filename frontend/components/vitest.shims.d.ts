// Stale as of vitest 4: @vitest/browser no longer ships provider type definitions
// under providers/ — they moved to standalone packages. This line becomes
// /// <reference types="@vitest/browser-playwright" /> whenever the Storybook
// browser-test setup is finished (see .storybook/vitest.setup.ts).
//
// Harmless today: this file sits outside the "include" list of tsconfig.json,
// so tsc never resolves the reference.
/// <reference types="@vitest/browser/providers/playwright" />
