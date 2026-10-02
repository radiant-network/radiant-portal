# Frontend

## Getting Started

See [Onboarding documentation for newcomers](./docs/onboarding.md)

### Prerequisites

- Node.js (> 20.18.0)
- Mac or Linux OS
- Make

### Installing

1. Clone the repository

2. Install the dependencies.
   Frontend is a workspace. It contains multiple projects that work together. To make them see each other and import each other you need to install the dependencies of the workspace at the root of the frontend folder first.

   ```shell
   cd radiant-portal/frontend/
   npm install
   ```

3. Run the server

```bash
git clone git@github.com:radiant-network/radiant-portal.git
cd radiant-portal/frontend
npm install
cd portals/radiant
npm run dev:radiant
```

### Running server with docker

```bash
make docker-build-radiant
make docker-run-radiant
```

You can replace `radiant` with a specific portal name.

### Generate the API client

Go to the root of the repo in the backend folder and run the following command:

```bash
openapi-generator-cli generate -i ./backend/docs/swagger.yaml -g typescript-axios -o ./frontend/api
```

# Documentation

[Onboarding documentation for newcomers](./docs/onboarding.md)

[Project Structure Documentation](./docs/project-structure.md)

[Code Convention Documentation](./docs/code-conventions.md)

[Theme and Figma documentation](./docs/theme.md)

[shadcn convention documentation](./docs/shadcn.md)

[Create An Application](./docs/create-an-application.md)

[Managing form](./docs/form.md)

[Query-Builder](./docs/query-builder.md)

[Table and Tanstack headless UI](./docs/table.md)

## Development Workflow

1. **Components Development**: Build reusable components in the `Components` directory.
2. **Theme Integration**: Apply consistent styles using the `Themes` directory. Tailwindcss is used for styling.
3. **Application Assembly or Application Page**: Use the `Apps` directory to create full applications by combining components and pages. See [Create An Application](./docs/create-an-application.md)
4. **Portal Customization**: Configure and generate multiple portals via the `Portals` directory. radiant should be a builder for the other portals. Different configurations define which portals should be built.
5. **Testing and Documentation**: Use `Storybook` to test components in isolation and demonstrate their usage.

---

## Example Use Cases

1. **Adding a new component**:
   - Create the component in `Components`.
   - Test it in `Storybook` with multiple themes.
   - Integrate it into the relevant application or portal.

2. **Creating a new portal**:
   - Define the portal configuration `Portals` to be loaded at build time.
   - Apply a specific theme from the `Themes` directory.

3. **Theming an existing application**:
   - Add or modify theme assets in the `Themes` directory.
   - Test theme changes in `Storybook` and verify them in the application or portal.

---

This structure ensures modularity, reusability, and scalability across the project while maintaining consistency through shared components and themes.

## Pull Request workflow

- Create a new branch (feat/SJRA-XXXX, fix/SJRA-XXXX, chore/SJRA-XXXX)
- Implement the new feature/bugfix
- Create a new pull request
- Assign a frontend developer as a reviewer
- Wait for frontend developer approval
- Add the cypress label (make sure the branch has been rebased with the latest version of main)
- Check qlin-ferlease status in the qlin-ferlease slack
- Move the Jira ticket to QA
- Wait for QA to update the Cypress test and move the Jira ticket to `Ready to Merge`
- Merge the PR to main
- Move the Jira ticket to Ready To Deploy

## Unit Testing

For small specific cases (regex, small functions), unit tests can be implemented and run locally. The UI and user interactions should not be tested through unit tests; they are covered through the Cypress test suite.


## Claude skills for non-frontend developers

Non-frontend developers need to use the `frontend-ui-consumer` Claude skill. It needs to be added locally to your environment.

```markdown
---
name: frontend-ui-consumer
description: >
  Use when a backend/full-stack dev edits frontend code (any .tsx/.jsx under `frontend/apps/`, `frontend/portals/`, or `frontend/components/`) to wire data into existing UI — fetching, forms, routing, column setup, etc. Enforces consumer-only mode: compose from existing primitives, never create or mutate UI components, never write custom Tailwind values, never use raw interactive HTML. Skip for pure frontend engineering work (new design-system components, Storybook additions, shadcn primitive edits).
metadata:
  type: guardrail
  audience: backend-full-stack
---

You are helping a backend/full-stack engineer integrate data into an existing front-end layout. You are strictly a **consumer** of the UI library.

## Forbidden

- Creating new UI components in `frontend/components/base/` or `frontend/components/base/shadcn/`
- Mutating any file in `frontend/components/base/shadcn/`
- Running `npx shadcn@latest add <component>` on a component that already exists in `frontend/components/base/shadcn/` — the CLI overwrites the file silently and wipes any local modifications. If a primitive needs changes, edit it in place.
- Writing arbitrary Tailwind values: `h-[42px]`, `bg-[#f3f4f6]`, `text-[14.5px]`, `w-[320px]`, etc.
- Using raw interactive HTML: `<button>`, `<input>`, `<select>`, `<textarea>`, `<a>` for in-app routes
- Hand-rolling layout primitives when a wrapper exists (modals, dropdowns, tooltips, tables, forms, badges, etc.)

## Component selection order

Mirror `frontend/CLAUDE.md`:

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

## Hard stop

If a requested UI feature or design pattern cannot be achieved with existing primitives + wrappers + tokens, **STOP IMMEDIATELY** and tell the user a front-end engineering handoff is required. Do not improvise a custom component, do not inline SVGs, do not write arbitrary Tailwind. Name the gap specifically ("the design calls for a split-button dropdown, no wrapper exists for that") so the FE handoff is actionable.
```
