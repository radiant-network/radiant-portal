# Portal

A portal defines a unique instance of a project (radiant, kids-first, include, etc.).

## Layout

Every portal uses `portals/{my_portal}/layout/protected-layout.tsx` to define the portal layout. It can be used to declare and implement
global reducers (e.g. LoginContext, TenantProvider, etc.) and customize the main navigation bar (`MainNavbar` component).

## Routes

Every route (protected and public) is defined in the file `portals/app/{my_portal}/app/routes.tsx`. The mapping is created by importing pages from `Apps`.
e.g.

```typescript

// portals/radiant/app/routes/analysis/list.tsx
import AnalysisExploration from 'analysis/exploration/analysis-exploration';

function AnalysisExplorationRoute() {
  return <AnalysisExploration />;
}

export default AnalysisExplorationRoute;


// portals/radiant/app/routes.tsx

{...}
    route('analysis', './routes/analysis/list.tsx'),
{...}
```

## Translations

Translations can be portal-specific by using an override system.

1. Create a new translation JSON file in `frontend/translations/{my_portal}/{lang}.json`
2. Override the translations string (e.g. `common.cancel`).
3. In the code, when calling 'common.cancel', the overridden string will be used

See [translation](./translation.md) for more information.

## Theme

Themes (variable, class, assets, fonts etc.) can be portal-specific by using an override system.

1. Create a new theme.css inside `frontend/themes/{my_portal}`
2. Define new Tailwind classes or override existing ones

See [theme](./theme.md) for more information.
