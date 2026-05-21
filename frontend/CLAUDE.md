# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

React 19 + React Router 7 monorepo for the Radiant Portal — a medical/genomic data platform. Supports multiple portal builds (radiant, kf) from a single codebase via compile-time configuration.

Node.js > 20.18.0 required.

## Common Commands

```bash
# From frontend/
npm install             # Install all workspace dependencies (run once at root)
npm test                # Run Vitest unit tests
npm run lint            # ESLint check
npm run lint:fix        # ESLint auto-fix

# From frontend/portals/radiant/
npm run dev:radiant     # Dev server on port 3000
npm run build:radiant   # Production build
npm run typecheck       # react-router typegen + tsc

# Storybook (from frontend/components/)
npm run storybook:radiant
```

To run a single test file:
```bash
# From frontend/
npx vitest run path/to/file.test.ts
```

## Architecture

### Workspace Structure

npm workspaces are defined in `frontend/package.json`. Packages import each other directly from source (no build step between packages).

```
frontend/
├── api/              # Auto-generated Axios client from OpenAPI spec (do not edit manually)
├── apps/             # Self-contained domain applications (variant, case, file-archive, query-builder-v3)
├── components/       # Shared UI library
│   ├── base/         # Reusable components; base/shadcn/ for shadcn primitives
│   ├── cores/        # Headless logic (models, types, stateless features)
│   ├── hooks/        # Shared React hooks
│   └── stories/      # Storybook stories
├── portals/
│   └── radiant/      # Portal build entry point (routing, layout, config, theme wiring)
│       ├── app/
│       │   ├── routes/   # Route components (thin wrappers that load app pages)
│       │   └── routes.ts # Route definitions
│       └── config/       # Portal-level config (injected as global PROJECT at build time)
├── themes/           # Theme assets (CSS, logos) per portal name
├── translations/     # i18n JSON files (common/ and portals/{portal}/)
└── utils/            # Shared utilities
```

### Layered Architecture

```
Portal (radiant/) — routing, layout, config, theme
    └── Apps (apps/) — domain pages and modals, no nav/layout
        └── Components (components/) — shadcn + custom UI, hooks, headless logic
            └── API client (api/) — auto-generated from backend OpenAPI spec
```

### Multi-Portal Strategy

The `THEME` env var at build time selects which portal/theme to compile. The portal config is injected as the global `PROJECT` variable via Vite. Use `@components/utils/config.ts` to access config at runtime.

Build commands follow `npm run dev:{portal}` / `npm run build:{portal}`.

### Path Aliases (in portal tsconfig.json)

| Alias | Resolves to |
|---|---|
| `@/components/*` | `../../components/*` |
| `@/hooks/*` | `../../components/hooks/*` |
| `@/api/*` | `../../api/*` |
| `@assets/*` | `../../themes/radiant/assets/*` |
| `variant/*` | `../../apps/variant/src/*` |
| `~/*` | `./app/*` (portal-local) |

### Adding a New Application

1. Run `cli/create-application/create-app.sh` with a kebab-case name
2. Add the path alias to `frontend/portals/radiant/tsconfig.json`
3. Register the route in `frontend/portals/radiant/app/routes.ts`
4. Create a thin route wrapper in `frontend/portals/radiant/app/routes/{name}/`
5. Optionally add to the nav in `protected-layout.tsx`

App folders follow: `components/` (composed UI) and `features/` (domain-specific).

### API Client

Generated from `backend/docs/swagger.yaml`. Regenerate from repo root:
```bash
make generate-client-typescript
```
Never edit files in `frontend/api/` manually.

### Translations (i18n)

Uses i18next. Layered: `translations/common/{lang}.json` → `translations/portals/{portal}/{lang}.json` (portal overrides common). Selected by `THEME` at build time.

```tsx
import { useI18n } from '@components/hooks/i18n';
const { t } = useI18n();
```

Use `<Trans>` component for translations containing React elements (links, badges, etc.).

### shadcn Components

New shadcn primitives must be installed via CLI inside `frontend/components/`:
```bash
npx shadcn@latest add accordion
```
They land in `components/base/shadcn/` (lowercase folder names). Never re-run the CLI on an existing component — modify it directly instead.

### Component Selection Order

When suggesting UI components, follow this priority:

1. **Storybook stories** (`frontend/`) — check here first; these reflect our actual design system
2. **Existing wrappers** in `frontend/components/` — a wrapper may exist even without a story
3. **shadcn/ui primitives** — last resort; flag explicitly when falling back here so gaps in the design system stay visible; always apply our design tokens and Tailwind config, never shadcn defaults

## Conventions

- **Files/folders**: kebab-case everywhere (`user-profile.tsx`, `all-profiles/`)
- **Folder names**: plural (`components/`, `utils/`)
- **Component suffixes**: `Page`, `Layout`, `Card` etc. to signal role
- **Route paths**: kebab-case (`/user-profile`)
- **Component structure**: hooks → state/refs → derived values → handlers → JSX
- **Commit format**: `type(scope): SJRA-### message` (enforced by CommitLint + Husky)
- **Tailwind**: use semantic color names (`warning-bg`, `primary-text`), avoid dynamic class generation
- **Test files**: co-located with the component they test
