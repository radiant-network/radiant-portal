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
- the matching `PortalConfig` as the global `__PROJECT__`
- the matching assets alias `@assets/*` → `themes/{THEME}/assets/*`
- the matching merged translations under `translations/portals/{THEME}/`

## Routing — dispatcher + per-theme composition

React Router 8 Framework mode requires a single `app/routes.ts` per app. The portal uses it as a **dispatcher** that picks the right route set by theme:

```
app/routes.ts                    # dispatcher — picks perTheme[THEME]
config/routes.module.ts          # app-based route constants (reusable building blocks)
config/routes.radiant.ts         # radiant composition
config/routes.include.ts         # include composition
config/routes.kf.ts              # kf composition
config/routes.qlin.ts            # qlin composition
```

### `app/routes.ts` — dispatcher

```ts
import type { RouteConfig } from '@react-router/dev/routes';
import includeRoutes from '../config/routes.include';
import kfRoutes from '../config/routes.kf';
import qlinRoutes from '../config/routes.qlin';
import radiantRoutes from '../config/routes.radiant';

const perTheme = {
  radiant: radiantRoutes,
  include: includeRoutes,
  kf: kfRoutes,
  qlin: qlinRoutes,
} satisfies Record<string, RouteConfig>;

const theme = (process.env.THEME ?? 'radiant') as keyof typeof perTheme;
export default perTheme[theme];
```

> The react-router config loader does **not** honor tsconfig aliases (`@/config/*`). Use relative paths (`../config/routes.radiant`) when importing from inside `app/routes.ts`.

### `config/routes.module.ts` — app-based building blocks

Routes are grouped **by app**, not by sharing semantics. Each app owns a constant that lists its route entries:

```ts
export const VARIANT = [route('variants/entity/:locusId', './routes/variants/entity.tsx')];

export const CASE = [
  route('case/', './routes/cases/list.tsx'),
  route('case/entity/:caseId', './routes/cases/entity.tsx'),
];

export const PATIENT = [
  route('patient/', './routes/patients/list.tsx'),
  route('patient/entity/:patientId', './routes/patients/entity.tsx'),
];
// ... STUDY, COMMUNITY, FILE_ARCHIVE, ANALYSIS, ADMIN
```

System-level groups (not apps) also live here:

- `LANDING_INCLUDE`, `LANDING_KIDSFIRST` — one landing page each, outside `:tenant`
- `AUTH` — auth callback / logout / refresh-token
- `PROXY_YAC` — `api/yac/*?` → `yac-proxy.ts`
- `PROXY_API` — `api/*?` → `proxy.ts` (catch-all)

### `config/routes.<theme>.ts` — composition

Each theme lists the apps it exposes inside the `:tenant` layout and spreads the structural groups it needs:

```ts
// routes.qlin.ts — no patient/study/community, no yac
import { ADMIN, ANALYSIS, AUTH, CASE, FILE_ARCHIVE, PROXY_API, VARIANT } from './routes.module';

export default [
  route('health-check', './routes/health-check.tsx'),
  route(':tenant', './layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    ...VARIANT,
    ...CASE,
    ...FILE_ARCHIVE,
    ...ANALYSIS,
    ...ADMIN,
  ]),
  index('./routes/tenant-redirect.tsx'),
  ...AUTH,
  ...PROXY_API,
] satisfies RouteConfig;
```

Reading this file answers "what does qlin ship?" without hunting through a shared constant.

## Tree-shaking guarantee

A theme that doesn't import an app's constant doesn't bundle the app. react-router only compiles route modules reachable from the final exported `RouteConfig`. Strings like `'./routes/patients/list.tsx'` inside the `PATIENT` constant are inert text until a composition spreads `PATIENT` into its tree.

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
4. Create `portals/radiant/config/<name>.ts` exporting `<name>Config: PortalConfig`
5. Create `portals/radiant/config/routes.<name>.ts` composing apps from `routes.module.ts`
6. Register in `portals/radiant/app/routes.ts` (`perTheme`) and `portals/radiant/vite.config.mts` (`configs`)
7. Add `dev:<name>`, `build:<name>`, `start:<name>` scripts in `portals/radiant/package.json`

## Adding a route

1. Create the route module at `portals/radiant/app/routes/<area>/<name>.tsx` (thin wrapper on the page from `apps/<app>/`)
2. Add the `route(...)` entry to the matching app constant in `config/routes.module.ts` (or create a new constant if it's a new app)
3. Spread the constant in each `routes.<theme>.ts` that should expose it

Only the themes that reference the constant include the route in their build.

## Capability flags for theme-aware UI (`__APPS_<NAME>__`)

The portal exposes **build-time boolean flags** that mirror which apps a theme has routed, so UI code (navbar, dashboards, etc.) can show/hide features without hardcoding theme name checks.

```tsx
...(__APPS_PATIENT__
  ? [{ title: t('main_navbar.links.patients'), icon: <UsersIcon />, ... }]
  : []),
```

For `THEME=qlin` (no `PATIENT` in its routes), `__APPS_PATIENT__` substitutes to `false`, the ternary branch is dead, Terser DCE's the entry — including the `UsersIcon` import if nothing else uses it.

### How it works

1. **`compute-apps.ts`** reads `config/routes.<THEME>.ts`, matches `...<APP>` spreads via regex, returns a `{ __APPS_<NAME>__: boolean }` map.
2. **`vite.config.mts`** spreads that map into Vite's `define` so each flag becomes a literal `true`/`false` substitution across the whole bundle.
3. **`app/types/apps.d.ts`** declares every flag as `declare const __APPS_<NAME>__: boolean;` for TypeScript.
4. **UI code** uses `...(__APPS_PATIENT__ ? [...] : [])` guards.

### Why individual booleans, not an object

The first version used `__APPS__: { patient: true, ... }` injected as an object literal. **It did not DCE** — Terser doesn't reliably fold `{...}.patient` on an inlined object literal, so the dead branch (and its icon import, i18n key, path) survived in the bundle. Verified by grep on `main_navbar.links.patients` in the qlin build.

Individual `__APPS_<NAME>__: true` substitutions turn the ternary into `true ? [...] : []`, which folds trivially. Verbose, but reliable.

### Adding a new capability flag

When you add a new app constant to `routes.module.ts`:

1. Add the uppercase constant name to `APP_CONSTANTS` in `portals/radiant/compute-apps.ts`
2. Add `declare const __APPS_<NAME>__: boolean;` to `portals/radiant/app/types/apps.d.ts`
3. Use `__APPS_<NAME>__` as a guard in any UI that depends on the app being routed

The flag flips automatically based on whether `...<NAME>` is spread in any `routes.<theme>.ts` composition — single source of truth.

### Verifying DCE

```bash
THEME=qlin npm run build
grep -ohE "main_navbar\.links\.[a-z_]+" build/client/assets/*.js | sort -u
```

Expected: only links for apps that qlin's `routes.qlin.ts` spreads. If a flag doesn't fold, the i18n key or icon reference leaks into the bundle — treat as a regression and investigate the define pattern.

## Layout

Every theme uses `portals/radiant/app/layout/protected-layout.tsx` as the `:tenant` layout. It wraps authenticated routes with the tenant provider and the main nav (`protected-navbar.tsx`). Theme-specific nav links are gated by `__APPS_<NAME>__` flags (see above) so Vite tree-shakes unused entries per theme bundle.

## Translations

Portal-specific overrides live in `frontend/translations/portals/{theme}/{lang}.json` and override `translations/common/{lang}.json` at build time. See [translation](./translation.md).

## Theme assets

Theme CSS and visual assets live in `frontend/themes/{theme}/`. See [theme](./theme.md).
