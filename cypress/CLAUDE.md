# CLAUDE.md — Cypress Tests

This file provides guidance to Claude Code when working in the `cypress/` directory.

## Overview

End-to-end (E2E) and API test suite for the Radiant Portal. Tests run against a live QA environment using Cypress with a Page Object Model (POM) pattern.

- **QA base URL**: `https://radiant.qa.juno.cqdg.ferlab.bio/`
- **API base URL**: `https://radiant-api.qa.juno.cqdg.ferlab.bio/`
- **Auth**: Keycloak at `https://auth.qa.juno.cqdg.ferlab.bio`

## Directory Structure

```
cypress/
├── api/                   # API tests (organized by resource)
│   ├── Batches/           # Batch job management
│   ├── Cases/
│   │   ├── Autocomplete/  # Autocomplete suggestions
│   │   ├── Batch/         # Batch case operations
│   │   └── Search/        # Case search filtering
│   ├── Documents/
│   │   └── Search/        # Document/file search
│   ├── Occurrences/
│   │   └── Germline/
│   │       ├── CNV/
│   │       │   ├── Count/ # CNV facet counts (Variant, Gene, Frequency, MetricQC)
│   │       │   └── List/  # CNV list pagination
│   │       └── SNV/
│   │           ├── Count/ # SNV facet counts (Variant, Gene, Pathogenicity, Frequency, Occurrence)
│   │           └── List/  # SNV list pagination
│   ├── Patients/
│   │   └── Batch/         # Batch patient creation (Valid, BlankFields, InvalidValues, etc.)
│   │       └── ProcessWorker/
│   ├── Samples/
│   │   └── Batch/         # Batch sample operations
│   │       └── ProcessWorker/
│   └── Sequencing/
│       └── Batch/         # Batch sequencing operations
│           └── ProcessWorker/
├── e2e/                   # E2E UI tests (organized by feature/page)
│   ├── Cases/             # Case list table tests
│   ├── CaseEntity/        # Case detail page (Details, Files, Variants SNV/CNV)
│   ├── Connexion/         # Login tests
│   ├── Files/             # Files list tests
│   └── VariantEntity/     # Variant detail page (EvidCond, Frequency, Patients)
├── pom/                   # Page Object Model
│   ├── pages/             # 18 page objects (one per page/component)
│   └── shared/            # Selectors.ts, Data.ts, Utils.ts, Texts.ts
├── support/               # Custom commands and global setup
│   ├── commands.ts        # UI commands (login, navigation, table ops, assertions)
│   ├── apiCommands.ts     # API commands (getToken, apiCall, validators)
│   ├── e2e.js             # Global before() hook, token caching
│   ├── globalData.js      # Runtime shared data (token, batch IDs, counts)
│   └── index.d.ts         # TypeScript definitions for custom commands
├── fixtures/
│   └── RequestBody/       # JSON templates (ApplyFacet, Sort payloads)
└── plugins/
    └── index.ts           # Env var loading from dotenv
```

Config lives at repo root: `cypress.config.ts`.

## Running Tests

```bash
# Open Cypress UI (interactive)
npx cypress open

# Run all tests headless
npx cypress run

# Run a specific spec
npx cypress run --spec "cypress/e2e/Cases/Columns.cy.ts"

# Run only API tests
npx cypress run --spec "cypress/api/**/*.cy.ts"

# Formatting and type-checking (from repo root)
npm run format:cypress
npm run format:cypress:check
npm run type-check:cypress
```

Environment variables are loaded from `.env` at repo root. Required:
- `CYPRESS_USER_USERNAME`, `CYPRESS_USER_PASSWORD` — test user credentials
- `KEYCLOAK_CLIENT_SECRET` — OAuth client secret

## Page Object Model (POM) Pattern

Each page object in `pom/pages/` exports an object with:

- **`tableColumns[]`** — Column metadata (id, name, apiField, sortable, pinnable, tooltip, position)
- **`actions`** — Methods that perform user interactions
- **`validations`** — Methods that assert expected state

```typescript
// Example: pom/pages/CasesTable.ts
export default {
  tableColumns: [
    { id: 'case_id', name: 'Case ID', sortable: true, pinnable: true, ... },
  ],
  actions: {
    clickRow(caseId: string) { ... },
  },
  validations: {
    shouldShowColumnContent(columnId, expected) { ... },
  },
};
```

Shared POM utilities in `pom/shared/`:
- **`Selectors.ts`** — 60+ reusable CSS/data-cy selectors (`CommonSelectors`)
- **`Data.ts`** — Test data constants (case IDs, patient info, expected values)
- **`Utils.ts`** — Helpers: `buildBilingualRegExp()`, `getColumnPosition()`, `getDateTime()`, etc.
- **`Texts.ts`** — Bilingual EN/FR text constants for validation

## Custom Cypress Commands

### UI Commands (`support/commands.ts`)

| Command | Purpose |
|---|---|
| `cy.login()` | OAuth login via Keycloak (with session caching) |
| `cy.logout()` | Logout |
| `cy.visitCasesPage()`, `cy.visitFilesPage()`, etc. | Navigate to specific pages |
| `cy.visitAndIntercept(url, method, routeAlias)` | Navigate and set up API intercept |
| `cy.clickAndWait(selector)` | Click then wait for load spinner to disappear |
| `cy.waitWhileLoad(ms)` | Poll for `.animate-pulse` disappearance |
| `cy.sortTableAndIntercept(column, routeAlias)` | Click column header + wait for API |
| `cy.pinColumn()` / `cy.unpinColumn()` | Pin/unpin table columns |
| `cy.resetColumns()` | Reset column visibility and order |
| `cy.hideColumn()` / `cy.showColumn()` | Toggle column visibility |
| `cy.setLang('EN'\|'FR')` | Switch UI language |
| `cy.validateTableFirstRowContent(colIdx, expected)` | Assert cell text content |
| `cy.shouldBeSortable()`, `cy.shouldBePinnable()`, etc. | Column capability assertions |

### API Commands (`support/apiCommands.ts`)

| Command | Purpose |
|---|---|
| `cy.getToken()` | Password grant → returns access_token |
| `cy.apiCall(method, path, body, token)` | Authenticated request with auto-retry on 500. `path` is tenant-scoped without the tenant prefix (e.g. `cases/search`); the tenant segment (`api_tenant`) is prepended automatically |
| `cy.validateAcceptedBatchResponse(resp, type)` | Assert batch creation response structure |
| `cy.validateSuccessBatchProcessed(resp)` | Assert completed batch (status=SUCCESS) |
| `cy.validateReport(resp, level, code, msg, path)` | Assert error/warning/info in report |
| `cy.validateSummary(resp, created, updated, ...)` | Assert batch summary counts |

## Authentication

Two distinct auth flows:

1. **E2E tests** — OAuth code flow via `cy.login()`. Uses `cy.origin()` for cross-origin Keycloak. Sessions are cached to avoid re-login per test.
2. **API tests** — Password grant via `cy.getToken()`. Returns bearer token passed to `cy.apiCall()`.

Token and global data are cached in `.cached-data.json` between runs (managed by `support/e2e.js`).

## Common Test Patterns

### E2E test structure

```typescript
describe('Feature', () => {
  beforeEach(() => {
    cy.login();
    cy.visitCasesPage();
    cy.setLang('EN');
    cy.resetColumns();
  });

  it('should display column data', () => {
    cy.validateTableFirstRowContent(colIdx, expectedData);
  });

  it('should sort by column', () => {
    cy.sortTableAndIntercept('column_id', 'routeAlias');
    cy.wait('@routeAlias');
    // assert order
  });
});
```

### API test structure

```typescript
it('should create a batch', () => {
  cy.getToken().then((token) => {
    cy.apiCall('POST', 'patients/batch?dry_run=true', body, token).then((resp) => {
      cy.validateAcceptedBatchResponse(resp, 'patient');
    });
  });
});
```

### Waiting for page load

Avoid using hardcoded `cy.wait(ms)`. Use `cy.waitWhileLoad()` which polls for the `.animate-pulse` spinner to disappear, or use intercept + `cy.wait('@alias')` to wait for specific API calls.

## Writing New Tests

1. **New page/feature** — Create a page object in `pom/pages/`, add selectors to `pom/shared/Selectors.ts` if reusable, add test data to `pom/shared/Data.ts`.
2. **New E2E spec** — Place in the appropriate `e2e/{Feature}/` folder. Follow the `beforeEach` login + navigate.
3. **New API spec** — Place in `api/{Resource}/`. Use `cy.getToken()` + `cy.apiCall()`.
4. **New custom command** — Add to `support/commands.ts` (UI) or `support/apiCommands.ts` (API), and update type definitions in `support/index.d.ts`.

## Entity Page Validation Tests

Pattern for tests that validate an entity-detail page (one tab = one set of cards/sections, e.g. `VariantEntity/Overview`). Reference implementation: `e2e/VariantEntity/Overview/` + `pom/pages/VariantEntity_Overview.ts`.

### Folder & file naming

```
e2e/<Entity>/<Tab>/
├── <Card>_InformationDisplayed.cy.ts   # text/value content per field
├── <Card>_Hyperlinks.cy.ts              # href assertions
└── …                                    # one spec file per (Card × Concern)
```

- One `describe` per file, one `it` per field/link.
- `setupTest()` local helper does `cy.login()` + visit. Each `it` calls `setupTest()` (clean state per test).

### POM organisation

One file per tab: `pom/pages/<Entity>_<Tab>.ts`. Top-level shape:

```ts
const selectors = {
  tab: '[data-cy="<tab>-tab"]',
  <card>: {
    card: '[data-cy="<card>-card"]',
    // …card-specific function selectors (badge(key), row(id), …)
  },
};

export const <Entity>_<Tab> = {
  validations: { shouldHaveActiveTab, shouldHaveTitle },
  <card>: {
    actions:     { … },                  // user-triggered behaviours (clicks, dialog opens)
    validations: { shouldShowField, shouldHaveLink, … },
  },
};
```

`shouldShowField(fieldId, dataVariant)` pattern:

```ts
shouldShowField(fieldId: string, dataVariant: any) {
  if (isEmpty(dataVariant[fieldId])) {
    cy.get(`${selectors.<card>.card} ${CommonSelectors.datacy(fieldId)}`).should('not.exist');
  } else {
    switch (fieldId) {
      case '<special>': … break;        // e.g. list of badges, value with extra indicator
      default:
        cy.get(`${selectors.<card>.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', dataVariant[fieldId]);
        break;
    }
  }
},
```

`shouldHaveLink(fieldId, dataVariant)` follows the same switch pattern and reads the URL from `getUrlLink(fieldId, dataVariant)`.

### Selectors

- Source code: add `data-cy` in **kebab-case** to each labelled field/link (e.g. `data-cy="gene-symbol"`, `data-cy="aa-change"`).
- POM lookups: use `CommonSelectors.datacy(fieldId)` — the helper converts the snake_case `fieldId` from `Data.ts`/API to kebab-case automatically, so the same key drives the data, the selector, and the test name.
- Compound queries: `${card} ${CommonSelectors.datacy(fieldId)}` (scoping to the card avoids accidental matches elsewhere on the page).

### Test data (`pom/shared/Data.ts`)

- **Reuse top-level fields first.** Add new fields directly under `variantGermline` (or the relevant entity object) when they map to API/variant data, not under a tab-specific sub-object.
- Only create `<entity>.overview = { … }` (or similar) for values that are **genuinely page-specific** and don't exist elsewhere (e.g. aggregated classification counts).
- **`null` means hidden.** A field set to `null` (or `[]`/`{}`) signals the helper that the DOM element should not exist. The convention is enforced symmetrically:
  - `shouldShowField` short-circuits to `should('not.exist')` when `isEmpty(value)` is true.
  - `validateTableFirstRowContent(null, …)` converts `null` to `'-'` to match the `EmptyField` fallback in tables.
- Type the new sub-objects (`as Type` or `satisfies Type`) so empty placeholders (`null`, `[]`) don't bake narrow types and break user-filled values later.

### Hyperlinks

- Build hrefs via `getUrlLink(fieldId, data)` in `pom/shared/Utils.ts` rather than hardcoding URLs in the POM. Add a new `case` to `getUrlLink` for any new link source — keep all variant-URL construction in one switch.
- Same `fieldId` convention as `shouldShowField`: snake_case key that matches the data field.
- Internal app routes (e.g. `/variants/entity/{locus_id}?tab=…`) are valid `getUrlLink` cases too — keeps everything URL-related in one place.

### Source code instrumentation

When the existing components don't expose enough `data-cy` to target every field/link reliably, add them in the source as part of the test PR. Keep them kebab-case and aligned with the data key (e.g. data field `aa_change` → `data-cy="aa-change"`). For nested shared components (e.g. `ClassificationSection`), expose an optional `dataCy` prop and let the parent pass it.

**Never introduce new DOM (no wrapper `<span>` / `<div>`) just to host a `data-cy`.** Always attach the attribute to an element that's already in the tree:

1. The existing labelled element (`<div>`, `<a>`, `<Link>`, `<Button>`, …) — preferred.
2. The custom component that already renders the target DOM node. Shared components that spread `...props` to their root element (e.g. anything extending `React.HTMLAttributes<HTMLDivElement>` like `TranscriptIdLink`, `ConsequenceIndicator`) accept `data-cy` directly: `<TranscriptIdLink data-cy="transcript-id" … />`.
3. If the existing element is rendered unconditionally but the test expects `not.exist` when empty, gate the attribute with the same condition: `data-cy={value ? 'aa-change' : undefined}` (React omits `undefined` attributes). Do **not** wrap the children in a span just to make the attribute disappear.

Wrapping with an extra `<span>` (or any layout-irrelevant element) pollutes the DOM, can break flex/grid layouts, and makes the snapshot harder to read.

## Conventions

- **File naming**: PascalCase for page objects (`CasesTable.ts`), PascalCase for specs (`Columns.cy.ts`)
- **Selectors**: Prefer `data-cy` attributes. `data-cy` values must be kebab-case (e.g. `data-cy="case-id-cell"`). Centralize reusable selectors in `CommonSelectors`.
- **Bilingual tests**: Use `buildBilingualRegExp()` from Utils when validating text that could be EN or FR.
- **Column testing**: Define column metadata in the POM (`tableColumns[]`), use `getColumnPosition()` to find columns dynamically rather than hardcoding indices.
- **API retries**: `cy.apiCall()` auto-retries 500 errors (3 attempts). For async batch operations, poll until processed.
