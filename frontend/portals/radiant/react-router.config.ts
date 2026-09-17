import type { Config } from '@react-router/dev/config';

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    // Without it the plugin sets `optimizeDeps.entries` to `[]`, which Vite reads as
    // "nothing to scan": every dep behind a route is then discovered at navigation time
    // and each discovery invalidates the requests in flight (504 Outdated Optimize Dep).
    unstable_optimizeDeps: true,
  },
} satisfies Config;
