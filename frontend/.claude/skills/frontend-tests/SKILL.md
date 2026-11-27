---
name: frontend-tests
description: Decide where a frontend test belongs and write it there — Vitest node test, Storybook story with a play function, co-located *.browser.test.tsx with MSW, or Cypress e2e. Use when writing, adding or moving a frontend test, porting a Cypress spec out of Cypress, or asking "where should this test go".
---

# Frontend tests: pick the target, then write it

Before writing any frontend test, walk the decision tree below **in order** and stop at the first match. State the chosen target and the reason in one line before writing code.

## Decision tree

| #   | The test checks…                                                                                                                                                                                                                                | Target                                                                  | Location                                                                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | A **user journey**: navigation across pages, real QA data, auth/permissions, real files (IGV tracks), several screens chained                                                                                                                   | **Cypress e2e**                                                         | `cypress/e2e/<Page>/…cy.ts`, POM in `cypress/pom/pages/` — see `cypress/CLAUDE.md` |
| 2   | **Pure logic, no DOM**: column definitions and default settings (`*-table-settings.tsx`), URL builders, filter defaults (`FILTER_DEFAULTS`), formatters, utils                                                                                  | **Vitest node**                                                         | `<file>.test.ts` next to the file                                                  |
| 3   | The **rendered contract of a reusable primitive** in `components/base/` (labels, variants, icons, a11y name, look)                                                                                                                              | **Storybook story** with tag `vitest` + `play` (+ automatic screenshot) | `frontend/components/stories/<area>/<name>.stories.tsx`                            |
| 4   | The **behaviour of a component** — the request it sends (checked with MSW), router/loader data, app state, user typing/clicking inside one component — or any component that must not appear in the published Storybook (everything in `apps/`) | **Vitest browser test**                                                 | `<component>.browser.test.tsx` next to the component                               |

### Signals to detect the case

- **The file lives in `frontend/apps/` or `frontend/portals/`** → never a story (rule in `.claude/rules/universal.md`); it is case 2, 4 or 1.
- **The assertion is on an outgoing request** (sort, page, search, SQON, autocomplete) → case 4, even if the test types or clicks: the action stays inside one component and MSW checks the request. Example: `apps/case/src/exploration/table/case-exploration-table-filters.browser.test.tsx`.
- **The assertion is on what a real backend returns, or the flow leaves the page** → case 1.
- **The component already has a story** in `components/stories/` → add the `vitest` tag and a `play` to that story rather than writing a separate test.
- **Only data in, value out** (no React needed) → case 2.
- An action used **only to reach a state** (show all columns, open a section) does not make it a journey: render that state directly in Vitest.

## Writing each target

### 2. Vitest node

Plain `describe/it` with `expect`, no DOM. Runs with `npm test` (in `frontend/` and in `frontend/components`).

**External links** (OMIM, dbSNP, gnomAD, ClinVar, ClinGen, Ensembl, Franklin, Mondo/HPO…) are built only by the functions of `components/lib/external-links.ts` and tested in `components/lib/external-links.test.ts`. Never write an external URL template in JSX: add or reuse a function there, call it from the component, and add its case to the test with the expected URL spelled out in full. A link whose URL comes from the API as is (e.g. `cmc_mutation_url`) is backend data: it is not tested here.

### 3. Story with `play`

Reference: `components/stories/badges/badge.stories.tsx`, `components/stories/badges/analysis-type-code-badge.stories.tsx`.

```tsx
import { expect, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Components/Badges/Badge',
  component: Badge,
  tags: ['vitest'], // opt in to the Vitest run
  parameters: { design: { type: 'figma', url: '<figma link of the component>' } },
} satisfies Meta<typeof Badge>;

export const Variants: Story = {
  render: () => /* … */,
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByText('default')).toBeVisible();
  },
};

export const French: Story = { ...Default, globals: { locale: 'fr' }, play: /* French labels */ };
```

- Every story with the `vitest` tag gets a screenshot after its `play` (`.storybook/vitest.setup.ts`), framed on the component.
- Every story with the `vitest` tag must pass axe: the test run sets `a11y.test: 'error'` with the `color-contrast` rule off (theme palette, not fixable per component); names, roles and keyboard rules still apply. Fix a violation in the component (see `frontend/docs/accessibility.md`), never by weakening the test. `parameters: { a11y: { test: 'todo' } }` on a story is a last resort, with a one-line `TODO:` giving the reason.
- Every story whose assertions read translated text gets a `…French` twin (spread the English story, add `globals: { locale: 'fr' }`) asserting the French text, as in `analysis-type-code-badge.stories.tsx`. Text set by a `useEffect` after the locale switch needs `findBy…` or `waitFor`. Browser tests that only check a request stay in one language.
- When a translation changes on purpose, update the tests that assert the old text in the same PR (`grep` the old text in `components/stories` and `apps`), and re-run the screenshot update if it is visible in a capture.
- `parameters.screenshot`: `false` (no screenshot, e.g. a tooltip rendered in a portal), `{ fullWidth: true }` (tables, layouts), `{ viewports: { mobile: [375, 667], desktop: [1280, 800] } }` (one screenshot per size, only when the layout changes with width).
- Content rendered in a portal (tooltip, popover, dialog): `within(document.body).findByRole('tooltip')`.

### 4. Browser test with MSW

Reference: `apps/case/src/exploration/table/case-exploration-table-filters.browser.test.tsx`.

```tsx
import { http } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import {
  renderWithProviders,
  TEST_TENANT,
} from "@/components/tests/render-with-providers";
import { worker } from "@/components/tests/setup-browser";

it("requests the autocomplete with the typed prefix", async () => {
  const requests: URL[] = [];
  worker.use(
    http.get("*/api/:tenant/cases/autocomplete", ({ request }) => {
      requests.push(new URL(request.url));
      return httpCaseAutocompleteResponse(); // reuse responses from components/stories/api/
    }),
  );

  const screen = await renderWithProviders(
    <TableFilters loading={false} setSearchCriteria={() => {}} />,
    {
      config,
      routeId: PROTECTED_LAYOUT_ROUTE_ID, // when the component calls useRouteLoaderData
      loaderData: { sub: "test-user" },
    },
  );
  await userEvent.type(
    screen.getByPlaceholder("Case, patient, MRN, sample or run"),
    "283",
  );

  await expect
    .poll(() => requests.at(-1)?.searchParams.get("prefix"))
    .toBe("283");
  expect(requests.at(-1)!.searchParams.get("limit")).toBe("10");
});
```

- MSW paths start with `*/api/:tenant/…`: the test page is not served from `/`, so the relative paths of `stories/api/*` do not match.
- `renderWithProviders` (`components/tests/render-with-providers.tsx`) brings i18n, the `radiant` tenant, `ConfigProvider`, `TooltipProvider` and a data router. Extend it there instead of re-wrapping providers in a test.
- `components/tests/setup-browser.ts` starts MSW once and resets handlers and storage after each test.

## Commands (from `frontend/components`)

| Command                                | Runs                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------ |
| `npm test`                             | Vitest node (`unit` project)                                             |
| `npm run test:storybook:docker`        | Stories **and** browser tests, Chromium from the Playwright Docker image |
| `npm run test:storybook:docker:update` | Same, and (re)writes the reference screenshots                           |
| `npm run test:browser:docker`          | Browser tests only; add `-- <file name part>` to target one file         |

Reference screenshots are generated **only** with the Docker scripts; the local `test:storybook:update` renders differently and would fail in CI.

## Known pitfalls

- A new folder of test helpers must be in the `include` of `components/tsconfig.json`, otherwise the `@/…` aliases do not resolve and Vite fails with "Failed to fetch dynamically imported module".
- The story locale resets to `en` through `initialGlobals`; anything set in a `useEffect` (locale, data) needs `findBy…`, not `getBy…`.
- Do not assert an attribute that CSS overrides (e.g. an icon `width` under `[&_svg]:size-3`): the test passes while the screen does not change.
- Vitest mutates the browser config it receives: each project gets its own `browser()` object in `vitest.config.ts`.

## Before calling the test done

1. Run it and see it pass.
2. **Both languages**: if an assertion reads translated text, the `…French` twin exists and passes, with the French text spelled out (not read from `t()`).
3. **Accessibility**: the stories pass axe in `error` mode with no `a11y: { test: 'todo' }` added; any new interactive element has an accessible name translated under `a11y.<component>.<action>` in both `en.json` and `fr.json`.
4. **Counter-check**: break the code under test (a label, an icon, a request parameter, an `aria-label`) and see the test fail, then revert.
5. **When the test replaces a Cypress check**: delete the replaced `it`, delete the POM method nobody calls any more, and remove the spec from the shard lists if it is now empty. Say which Cypress test was removed in the PR description.
