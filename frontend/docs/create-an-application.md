# Create a new Page Application

A page application is a self-contained domain under `frontend/apps/`. It owns its pages, modals, features and models but no portal-level concerns (routing wrapper, layout, navbar).

## 1. Scaffold the app

```bash
./cli/create-application/create-app.sh
```

- Name must be kebab-case (`variant`, `file-archive`, `my-new-app`).
- Node v20.18.0+.

A new folder `frontend/apps/<my-new-app>/` is created with:
- `components/` — composed UI (tables, tabs, dialogs)
- `features/` — domain-specific logic (table-settings, cells, hooks)

## 2. Register the path alias

Edit `frontend/portals/radiant/tsconfig.json` and add the app to `paths`:

```json
"paths": {
  "@/config/*":    ["./config/*"],
  "@/api/*":       ["../../api/*"],
  "@/utils/*":     ["../../utils/*"],
  "@/components/*":["../../components/*"],
  "@/hooks/*":     ["../../components/hooks/*"],
  "@assets/*":     ["../../themes/radiant/assets/*"],

  "variant/*":     ["../../apps/variant/src/*"],
  "my-new-app/*":  ["../../apps/my-new-app/src/*"],
  "~/*":           ["./app/*"]
}
```

The alias is portal-wide: TypeScript resolves it for every theme that may use the app, but a theme that doesn't route into the app still won't bundle any of its code (see [Portal — Tree-shaking guarantee](./portal.md)).

## 3. Create the route wrapper

React Router Framework needs a route module per URL. Keep the wrapper trivial — it's the extension point for a future `loader` / `action` / `ErrorBoundary`.

```tsx
// frontend/portals/radiant/app/routes/my-new-app/list.tsx
import MyNewApp from 'my-new-app/exploration/my-new-app-exploration';

const MyNewAppRoute = () => <MyNewApp />;

export default MyNewAppRoute;
```

## 4. Add the app's routes to `routes.module.ts`

Routes are grouped by app. Create a new constant (uppercase, no suffix) in `frontend/portals/radiant/config/routes.module.ts`:

```ts
export const MY_NEW_APP = [
  route('my-new-app/', './routes/my-new-app/list.tsx'),
  route('my-new-app/entity/:id', './routes/my-new-app/entity.tsx'),
];
```

The `route(...)` paths are **relative to `app/`** (react-router convention), not to the file that declares them.

## 5. Spread the constant in each theme that should expose the app

Decide per theme whether the app is included. Edit `routes.<theme>.ts` for every theme that needs it:

```ts
// config/routes.radiant.ts
import {
  ADMIN, ANALYSIS, CASE, COMMUNITY, FILE_ARCHIVE, MY_NEW_APP,
  PATIENT, STUDY, VARIANT,
  AUTH, PROXY_API, PROXY_YAC,
} from './routes.module';

export default [
  route('health-check', './routes/health-check.tsx'),
  route(':tenant', './layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    ...VARIANT,
    ...CASE,
    ...FILE_ARCHIVE,
    ...ANALYSIS,
    ...ADMIN,
    ...PATIENT,
    ...STUDY,
    ...COMMUNITY,
    ...MY_NEW_APP,   // <-- new
  ]),
  index('./routes/tenant-redirect.tsx'),
  ...AUTH,
  ...PROXY_YAC,
  ...PROXY_API,
] satisfies RouteConfig;
```

A theme that doesn't spread `MY_NEW_APP` ships zero of its code. Verify after build:

```bash
THEME=qlin npm run build
grep -rl "my-new-app" build/client/assets/ || echo clean
```

## 6. Register the capability flag

Each app has a build-time boolean (`__APPS_<NAME>__`) that reflects whether the current theme's `routes.<theme>.ts` includes it. UI code uses that flag to show/hide features without hardcoding theme name checks. See [Portal — Capability flags](./portal.md#capability-flags-for-theme-aware-ui-__apps_name__) for the full mechanism.

Two files to update:

**`portals/radiant/compute-apps.ts`** — add the constant name to `APP_CONSTANTS`:

```ts
const APP_CONSTANTS = [
  'VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN',
  'PATIENT', 'STUDY', 'COMMUNITY',
  'MY_NEW_APP',   // <-- add
] as const;
```

**`portals/radiant/app/types/apps.d.ts`** — declare the flag for TypeScript:

```ts
declare const __APPS_MY_NEW_APP__: boolean;
```

The flag is now `true` for every theme whose composition spreads `...MY_NEW_APP`, `false` otherwise.

## 7. Add the nav link (optional)

Edit `frontend/portals/radiant/app/layout/protected-navbar.tsx`. Guard the link on `__APPS_<NAME>__` so it tree-shakes out of themes that don't route the app:

```tsx
...(__APPS_MY_NEW_APP__ ? [{
  title: t('main_navbar.links.my_new_app'),
  icon: <SparklesIcon />,
  to: localPath('/my-new-app'),
  as: Link,
  active: pathname === localPath('/my-new-app'),
}] : []),
```

For admin-only features, combine the flag with the permission check:

```tsx
...(__APPS_MY_NEW_APP__ && canAdministerTenant ? [{ ... }] : []),
```

The flag comes first — if the app isn't routed, no permission check runs and the branch is fully DCE'd.

Add the i18n key under `frontend/translations/common/{lang}.json` (or per-theme under `portals/{theme}/`).

## Page application folder structure

```
apps/my-new-app/src/
├── components/     # Table, Tabs, Dialog assemblies specific to this app
├── features/       # Table settings, cell renderers, hooks tied to this app
└── exploration/    # Entry page(s) that routes wrap
```

## Quick reference — files touched

| File | Change |
|---|---|
| `apps/<name>/src/*` | app code |
| `portals/radiant/tsconfig.json` | add `<name>/*` alias |
| `portals/radiant/app/routes/<area>/*.tsx` | thin route wrapper(s) |
| `portals/radiant/config/routes.module.ts` | `export const <NAME>` array |
| `portals/radiant/config/routes.<theme>.ts` | spread `...<NAME>` in each theme that exposes the app |
| `portals/radiant/compute-apps.ts` | add `'<NAME>'` to `APP_CONSTANTS` |
| `portals/radiant/app/types/apps.d.ts` | `declare const __APPS_<NAME>__: boolean` |
| `portals/radiant/app/layout/protected-navbar.tsx` | nav link guarded by `__APPS_<NAME>__` (optional) |
| `translations/common/*.json` | i18n keys |

## Verify after build

```bash
cd portals/radiant

# App should appear in themes that spread the constant:
THEME=radiant npm run build
grep -ohE "main_navbar\.links\.[a-z_]+" build/client/assets/*.js | sort -u

# App should be absent from themes that don't spread it:
THEME=qlin npm run build
grep -l "<name>-exploration" build/client/assets/*.js || echo "clean"
```

If an app leaks into a theme that doesn't spread it, check for unconditional imports in the navbar, layout, or shared config.

See [portal](./portal.md) for the full routing / dispatcher model and the capability-flag mechanism.
