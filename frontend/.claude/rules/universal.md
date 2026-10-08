# Frontend engineering rules

Apply these to every coding task in the React frontend (`frontend/`). They complement the conventions in [`frontend/CLAUDE.md`](../../CLAUDE.md) (file naming, folder structure, component suffixes, i18n, Tailwind tokens, shadcn selection order) and extend by editing this file, not by adding caveats to individual skills.

## DataTable cells live in their own component file

Column settings in `apps/*/src/**/table/*-table-settings.tsx` must stay a thin assembly of **columns + default settings**. Any `cell:` renderer with real rendering logic belongs in its own file under a sibling `table/cells/` folder so it can be reused and tested in isolation.

Reference: `apps/case/src/exploration/table/cells/` (`case-status-cell.tsx`, `case-assignment-cell.tsx`, `case-actions-menu-cell.tsx`) and `apps/case/src/entity/variants/{somatic,germline}-occurrence/table/cells/` (`somatic-hotspot-cell.tsx`, `clingen-cell.tsx`, …). The settings file only imports them.

### The rule

For every `cell:` renderer in a column settings file:

- **Extract to `./cells/<name>-cell.tsx`** when the renderer has any of:
  - More than one JSX element (wrapper + content).
  - A hook call (`useLocalPath`, `useI18n`, `useTenant`, …).
  - Conditional logic on the value (`value === 'alive' ? 'green' : 'neutral'`).
  - Formatting beyond a shared cell's own API (e.g. `days.toLocaleString() + ' d'`).
  - A tooltip, link, badge color, or icon driven by business meaning.
- **Keep inline** only when the renderer is one of:
  - `info => info.getValue()`
  - A one-line pass-through to a shared `components/base/data-table/cells/*` wrapper with no extra logic (e.g. `info => <TextTooltipCell tooltipText={row.foo_name}>{info.getValue()}</TextTooltipCell>`).

When in doubt, extract.

### File layout

```
apps/<app>/src/<area>/table/
├── <feature>-table-settings.tsx     # columns + createColumnSettings(...)
└── cells/
    ├── <feature>-link-cell.tsx
    ├── <feature>-status-cell.tsx
    └── …
```

- One component per file, kebab-case filename ending in `-cell.tsx`.
- Default-export the component. Name it `<Feature><Role>Cell` (`PatientLinkCell`, `VitalStatusCell`, `SurvivalCell`).
- Props are a small named `type <Name>CellProps = { … }` — accept the concrete values the cell needs (`value`, `days`, `patient`), not the whole `CellContext` unless several fields are read.
- Reuse the shared primitives from `components/base/data-table/cells/` (`BadgeCell`, `AnchorLinkCell`, `TextTooltipCell`, `DateCell`, `EmptyCell`, `NumberCell`, …) inside the extracted cell rather than reaching for raw shadcn components.

## Component selection order

When picking a UI component, follow this priority — do not jump to shadcn first.

1. **Storybook story first** — look under `frontend/components/stories/`. These reflect the real design system; the component used in a story is the right one.
2. **Existing wrapper** — look under `frontend/components/base/` (excluding `shadcn/`). A wrapper may exist even without a story.
3. **shadcn primitive** — only as a last resort, from `frontend/components/base/shadcn/`. Flag the gap explicitly in your response so the user knows you fell back here.

For common cases:
- Button → `@/components/base/shadcn/button`
- Input / Textarea / Select → shadcn equivalents in `base/shadcn/`
- Table → `@/components/base/data-table/data-table` (not raw `<table>` or shadcn `<Table>` directly)
- In-app navigation → wrap the path with `useLocalPath()` (for `<Link to={localPath('/case')}>`) or use `useLocalNavigation()` for programmatic nav. Both come from `@/components/hooks/use-local-path` and auto-prefix the current tenant. Never hand-write `/radiant/...`. Use raw `useNavigate` only for history moves (`navigate(-1)`).

## Styling

- Semantic tokens only: `bg-card`, `text-primary`, `warning-bg`, `primary-text`, `gap-4`, `p-2`, `rounded-md`
- Spacing / sizing via Tailwind scale (`gap-4`, `p-6`, `w-full`, `h-9`) — never arbitrary values
- Dark mode comes free via tokens; never write `dark:bg-[...]`

## i18n

Any user-visible string goes through `useI18n()` — no hardcoded strings in JSX. Keys live in `frontend/translations/`.

## Storybook

Stories live under `frontend/components/stories/` and are the source of truth for how a primitive is used.

- **Edit an existing story when you change the primitive's API.** If you add a prop, change a default, rename an export, or alter the rendered output of a component that already has a story, update that story in the same PR. A story that no longer matches the component is worse than no story.
- **Add a story only when you introduce a new reusable primitive in `frontend/components/base/` (not `shadcn/`).** The story documents the public surface and makes the primitive discoverable to the next consumer. Keep it minimal: one `default` export + representative `args` or `render`, no fetch calls, no router, no auth, no app-level state.
- **Do not add a story for app-level or page-level compositions in `frontend/apps/` or `frontend/portals/`.** Those are one-off assemblies, not reusable primitives — they belong in Cypress, not Storybook.
- If the pattern you need already has a story but the story is missing a variant you depend on (empty state, loading, long content), add that variant to the existing story rather than creating a new one.

## No narrative comments

The base system prompt already says: *"Default to writing no comments. Only add one when the WHY is non-obvious... Don't explain WHAT the code does... Don't reference the current task, fix, or callers."* This rule is routinely violated — this section exists to reinforce it.

### Forbidden

- Links to Notion, Jira, Figma, Confluence, wireframes.
- References to "the analysis", "the spec", "the ticket", "SJRA-###", "the design", section numbers like "§A2", or any external document.
- Explanations of what well-named identifiers already convey. Examples:
  - `// weight = render order among visible facets`
  - `// visible=false means the facet lives behind the "More" button`
  - `// Facets follow the Patient View analysis section A2`
- "For now" / "temporarily" / "until X lands" prose longer than one line — belongs in the PR description, not the file.
- Multi-line block comments describing design decisions, trade-offs, or how a group of fields relates to a document.
- Narrative comments on mock data describing where it came from ("Mock filter buckets lifted from...").

### Allowed

- One-line `TODO:` with a short reason. Examples:
  - `// TODO: replace with generated type from frontend/api/ once backend endpoint exists`
  - `// TODO: pass searchCriteria to fetchPatientsList once the backend endpoint lands`
  - `// TODO: fall back to the mock only on 404`
- A single short line explaining a non-obvious workaround, hidden invariant, or constraint — **only if** removing it would confuse a future reader AND the WHY cannot be inferred from the code or a `TODO:`.

### Decision procedure before writing any comment

1. Would a reader be confused if this comment vanished? If no → **delete it**.
2. Does the comment reference an external document? → **delete it**. That belongs in the PR description.
3. Does the comment explain what a named identifier already conveys? → **delete it**.
4. Is this prose longer than one line and not a `TODO:`? → **collapse to one line or delete it**.
5. If the comment survives all four checks, keep it short — one line, no URLs, no section references.

### After every code edit

Re-read the diff. If a comment appears that fails checks 1–4, remove it before reporting the task done.

## React patterns

This repo runs React 19 on Vite + React Router 8. Apply standard React 18+/19 practice; the items below are the ones that routinely regress.

### Core workflow

1. **Analyze requirements** — identify component hierarchy, state needs, data flow.
2. **Choose patterns** — pick state management (local, Context, SWR), data fetching approach (SWR + the generated `@/api/api` client).
3. **Implement** — write TypeScript components with proper types.
4. **Validate** — run `npx tsc --noEmit -p portals/radiant`; if it fails, fix every type error and re-run until clean before proceeding.
5. **Optimize** — memoize when passing callbacks/objects to memoized children; ensure accessibility (semantic HTML, ARIA).
6. **Test** — co-locate a Vitest + React Testing Library file next to the component when the logic is non-trivial.

### MUST DO

- Use TypeScript — no `any` unless already pervasive in the surrounding code (e.g. table cell generics).
- Use `key` props with stable, unique identifiers — never the array index for dynamic lists.
- Clean up effects — return a cleanup function from `useEffect` for subscriptions, listeners, timers.
- Use semantic HTML and ARIA for accessibility.
- Memoize (`useMemo`, `useCallback`, `React.memo`) when the value/callback is passed to a memoized child or into a dependency array where identity matters.
- Use `Suspense` boundaries around async-rendered subtrees.
- Order inside a component: hooks → state/refs → derived values → handlers → JSX. (Matches `frontend/CLAUDE.md`.)

### MUST NOT DO

- Mutate state directly (`state.items.push(...)`). Produce a new value and pass it to the setter.
- Use array index as a key for dynamic/reorderable lists.
- Define functions, objects, or arrays inline in JSX when they feed a memoized child (they break memo and cause re-renders).
- Forget `useEffect` cleanup — it leaks subscriptions/listeners.
- Ignore React strict-mode warnings; investigate the double-invocation they surface instead of silencing it.
- Reach for Next.js App Router / Server Component patterns — this repo is a Vite SPA, not Next.js.
