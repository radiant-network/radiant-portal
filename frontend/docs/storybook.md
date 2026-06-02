# Storybook

Our Storybook takes a component-driven approach: every new component should have
its own story. Stories live in:

```
frontend/components/stories
```

## Story titles

Every story's `title` follows the format `Family/Group/Component`, with all
segments in **Title Case with spaces** (e.g. `Components/Inputs/Multi Selector`).
The middle `Group` is optional and only groups related stories.

Top-level families (ordered in the sidebar via `storySort` in
`.storybook/preview.tsx`):

| Family        | What goes here                                    | Example                                  |
| ------------- | ------------------------------------------------- | ---------------------------------------- |
| `Foundations` | Design tokens and assets                          | `Foundations/Colors`                     |
| `Components`  | Generic, reusable UI building blocks (`base/`)    | `Components/Buttons/Action Button`       |
| `Features`    | Domain / genomic-specific components (`feature/`) | `Features/Indicators/Priority Indicator` |
| `Layout`      | Page chrome (navbar, sidebar, headers, errors)    | `Layout/Main Navbar`                     |
| `Utils`       | Display helpers / formatters                      | `Utils/Number Format`                    |

**Rules:**

- Title Case + spaces in titles — no `camelCase`, `PascalCase`, or `hyphen-case`
  (kebab-case still applies to file and folder names).
- Group names are plural when they hold several stories (`Buttons`, `Inputs`);
  drop the group when it would contain a single story
  (`Layout/Breadcrumb`, not `Layout/Breadcrumbs/Breadcrumb`).
- Keep all stories of one group under a single family.

## Table cell stories

When you need to add a new table cell to Storybook, you must update
`frontend/components/stories/table/cells-mock.tsx` to display the new cell.

## External Links

[Storybook Radiant Portal](https://radiant-network.github.io/radiant-portal)
