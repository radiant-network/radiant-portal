# Portal

A **portal** is a buildable instance of the frontend. The whole frontend ships from a single portal folder, `portals/radiant/`, which produces one of several **themes** at build time: `radiant`, `include`, `kf`, `qlin`. Each theme is a self-contained site with its own routes, assets, translations and config.

The theme is picked via the `THEME` env var:

```bash
cd portals/radiant/
npm run dev:radiant     # THEME=radiant
npm run dev:include     # THEME=include
npm run dev:kf          # THEME=kf
npm run dev:qlin        # THEME=qlin
```

`vite.config.mts` reads `THEME` and injects:
- the matching `PortalConfig` (`config/{THEME}/portal-config.ts`) as the global `__PROJECT__`
- the matching assets alias `@assets/*` → `themes/{THEME}/assets/*`
- the matching merged translations under `translations/portals/{THEME}/`

## Per-theme config — one folder per theme

```
config/
  <theme>/
    bundle.ts          # what the build compiles: apps, landing, extra routes — read at build time, in Node
    portal-config.ts   # PortalConfig: facets, saved filters, name — read at runtime, in the browser
  catalog.ts           # APP_NAMES, LandingName, ExtraName, BundleDefinition — imports nothing
  themes.ts            # THEMES, aggregating every bundle.ts
  routes.module.ts     # APP_ROUTES, LANDING_PAGES, EXTRA_ROUTES, shared groups
```

Every other config file depends on `catalog.ts`, never the reverse, so the type imports cannot form a cycle.

The two files stay separate because they have different readers. `bundle.ts` is loaded by `app/routes.ts` and `vite.config.mts` through the react-router config loader, so it only holds data and type imports. `portal-config.ts` imports runtime code (the API client, React context) and is shipped to the browser through `__PROJECT__`.

### `config/<theme>/bundle.ts` — what the theme ships

```ts
// config/kf/bundle.ts
export const kfBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN', 'PATIENT', 'STUDY', 'COMMUNITY'],
  landing: 'KIDSFIRST',
  extras: [],
} satisfies BundleDefinition;
```

- `apps` — the apps mounted under the `:tenant` layout.
- `landing` — optional public page served at `/landing`; each theme ships at most one.
- `extras` — other theme-specific routes outside `:tenant` (yac proxy).

A typo in any of them fails `tsc` in that file.

### `config/themes.ts` — the theme registry

`THEMES` maps each theme name to its bundle:

```ts
export const THEMES = {
  radiant: radiantBundle,
  include: includeBundle,
  kf: kfBundle,
  qlin: qlinBundle,
};
```

## Routing — one route builder

React Router 8 Framework mode requires a single `app/routes.ts` per app. It builds the route tree from `THEMES[THEME]`.

### `config/routes.module.ts` — building blocks

Routes are grouped **by app**, not by sharing semantics. `APP_ROUTES` maps each app to its route entries; `satisfies Record<AppName, …>` makes `tsc` fail if an app of `APP_NAMES` has no entry:

```ts
export const APP_ROUTES = {
  VARIANT: [route('variants/entity/:locusId', './routes/variants/entity.tsx')],
  CASE: [route('case/', './routes/cases/list.tsx'), route('case/entity/:caseId', './routes/cases/entity.tsx')],
  // ... FILE_ARCHIVE, ANALYSIS, ADMIN, PATIENT, STUDY, COMMUNITY
} satisfies Record<AppName, RouteConfigEntry[]>;
```

`LANDING_PAGES` maps each `LandingName` to its route module, mounted at `/landing` by the theme that picks it.

`EXTRA_ROUTES` holds the routes a theme may opt into through `extras`:

- `PROXY_YAC` — `api/yac/*?` → `yac-proxy.ts`

Groups every theme ships also live here:

- `AUTH` — auth callback / logout / refresh-token
- `PROXY_API` — `api/*?` → `proxy.ts` (catch-all)

### `app/routes.ts` — route builder

```ts
const theme: BundleDefinition = THEMES[(process.env.THEME ?? 'radiant') as ThemeName];

export default [
  route('health-check', './routes/health-check.tsx'),
  route(':tenant', './layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    ...theme.apps.flatMap(app => APP_ROUTES[app]),
  ]),
  index('./routes/tenant-redirect.tsx'),
  ...(theme.landing ? [route('landing', LANDING_PAGES[theme.landing])] : []),
  ...theme.extras.flatMap(extra => EXTRA_ROUTES[extra]),
  ...AUTH,
  ...PROXY_API,
] satisfies RouteConfig;
```

> The react-router config loader does **not** honor tsconfig aliases (`@/config/*`). Use relative paths (`../config/themes`) when importing from inside `app/routes.ts`.

## Tree-shaking guarantee

A theme that doesn't list an app in its `bundle.ts` doesn't bundle the app. react-router only compiles route modules reachable from the final exported `RouteConfig`. Strings like `'./routes/patients/list.tsx'` inside `APP_ROUTES.PATIENT` are inert text until a theme lists `PATIENT`.

Confirmed by build: a `THEME=qlin` build has **zero chunks** named `patient-*`, `study-*`, `community-*`, `landing-*`, or `yac-*`. The `apps/patient/`, `apps/study/`, `apps/community/`, `apps/landing/` sources never enter the bundle.

To verify after any change:

```bash
THEME=qlin npm run build
grep -rl "patient-exploration\|study-exploration" build/client/assets/ || echo clean
```

## Adding a theme

1. `cp -r themes/radiant themes/<name>` (or create fresh assets)
2. `cp -r translations/portals/radiant translations/portals/<name>`
3. `cp -r portals/radiant/public/radiant portals/radiant/public/<name>`
4. Create `portals/radiant/config/<name>/portal-config.ts` exporting `<name>Config: PortalConfig`
5. Create `portals/radiant/config/<name>/bundle.ts` exporting `<name>Bundle` (its `apps`, optional `landing`, `extras`), and register it in `THEMES` (`config/themes.ts`)
6. Register `<name>Config` in `portals/radiant/vite.config.mts` (`configs`)
7. Add `dev:<name>`, `build:<name>`, `start:<name>` scripts in `portals/radiant/package.json`

## Adding a route

1. Create the route module at `portals/radiant/app/routes/<area>/<name>.tsx` (thin wrapper on the page from `apps/<app>/`)
2. Add the `route(...)` entry to the app's array in `APP_ROUTES` (`config/routes.module.ts`) — for a new app, see [create an application](./create-an-application.md)

Only the themes that list the app in their `bundle.ts` include the route in their build.

## Capability flags for theme-aware UI (`import.meta.env.APPS_<NAME>`)

The portal exposes **build-time boolean flags** that mirror which apps a theme has routed, so UI code (navbar, dashboards, etc.) can show/hide features without hardcoding theme name checks.

```tsx
...(import.meta.env.APPS_PATIENT
  ? [{ title: t('main_navbar.links.patients'), icon: <UsersIcon />, ... }]
  : []),
```

For `THEME=qlin` (no `PATIENT` in its bundle), `import.meta.env.APPS_PATIENT` substitutes to `false`, the ternary branch is dead, and the minifier drops the entry — including the `UsersIcon` import if nothing else uses it.

### How it works

1. **`compute-apps.ts`** reads `THEMES[THEME].apps` — the same list that builds the routes — and returns one `import.meta.env.APPS_<NAME>` boolean per entry of `APP_NAMES`.
2. **`vite.config.mts`** spreads that map into Vite's `define`: each flag becomes a literal `true`/`false` in the build, and a key of the injected `import.meta.env` object in dev.
3. **`app/types/vite-env.d.ts`** types every flag from `AppName`, and enables Vite's `strictImportMetaEnv`: an undeclared key — a typo such as `APPS_PATIENTS` — fails `tsc`.

### Why individual booleans, not an object

The first version used `__APPS__: { patient: true, ... }` injected as an object literal. **It did not DCE** — Terser doesn't reliably fold `{...}.patient` on an inlined object literal, so the dead branch (and its icon import, i18n key, path) survived in the bundle. Verified by grep on `main_navbar.links.patients` in the qlin build.

Individual `import.meta.env.APPS_<NAME>` substitutions turn the ternary into `true ? [...] : []`, which folds trivially.

### Adding a new capability flag

Nothing to declare: adding an app to `APP_NAMES` creates its `import.meta.env.APPS_<NAME>` flag and its type. Use it as a guard in any UI that depends on the app being routed.

The flag is `true` exactly when the app is listed in the theme's `apps`. Routes and flags read that same list, so they cannot disagree.

### Verifying DCE

```bash
THEME=qlin npm run build
grep -ohE "main_navbar\.links\.[a-z_]+" build/client/assets/*.js | sort -u
```

Expected: only links for apps listed in `config/qlin/bundle.ts`. If a flag doesn't fold, the i18n key or icon reference leaks into the bundle — treat as a regression and investigate the define pattern.

## Layout

Every theme uses `portals/radiant/app/layout/protected-layout.tsx` as the `:tenant` layout. It wraps authenticated routes with the tenant provider and the main nav (`protected-navbar.tsx`). Theme-specific nav links are gated by `import.meta.env.APPS_<NAME>` flags (see above) so Vite tree-shakes unused entries per theme bundle.

## Translations

Portal-specific overrides live in `frontend/translations/portals/{theme}/{lang}.json` and override `translations/common/{lang}.json` at build time. See [translation](./translation.md).

## Theme assets

Theme CSS and visual assets live in `frontend/themes/{theme}/`. See [theme](./theme.md).
