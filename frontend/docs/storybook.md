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

## Story content & layout

Inside a story's `render`, wrap the demo with the helpers from
`components/stories/story-section.tsx` instead of hand-rolled headings/padding,
so every canvas stays visually consistent.

### Helpers

| Helper          | Purpose                                                                        | Key props                                                            |
| --------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `StorySection`  | One titled block — use one per story; its title labels the demo in the canvas. | `title`, `description?`, `align?: 'start' \| 'center'`, `className?` |
| `StoryShowcase` | Lays out several `StorySection`s for a comparison.                             | `direction?: 'column' \| 'row'`                                      |
| `StoryLabel`    | Secondary sub-label inside a section (a matrix row/column axis).               | —                                                                    |

### Rules

- **One `StorySection` per story**, with a descriptive `title` (the component/variant name — not the literal "Default").
- **Comparison views** (several variants on one canvas): wrap the sections in `StoryShowcase` (`direction="row"` for side-by-side columns).
- **Sub-axes** inside a section (one row per size/type/state): label them with `StoryLabel`.
- **Width:** content keeps its natural width by default; a component that must span the canvas opts in with a `w-full` wrapper (alerts, tables, navbar…).
- **No hand-rolled headings** (`<h3 className="...">`) and **no manual page padding** (`p-4`) — rely on `StorySection` and the default `layout: 'padded'`. Never hardcode `text-lg`/`font-semibold` for a section title.
- **Semantic colors only** (`text-muted-foreground`, `bg-muted`, …) — never `text-gray-*` or hex.
- **Captions/notes** go in the `description` prop, not inline `<p>`/`<span>` preambles.
- **Heavy features** repeated across many stories (query builder, data table) factor a small per-file render helper returning `<StorySection>…</StorySection>`.
- **Exception:** a component rendered as a full-screen overlay (e.g. slider sheets) is left unwrapped — a title would be hidden behind the overlay.

### Example

```tsx
// Single variant
export const Default: Story = {
  render: () => (
    <StorySection title="Copy button">
      <CopyButton value="PAT123" />
    </StorySection>
  ),
};

// Comparison — one column per size
export const AllVariants: Story = {
  render: () => (
    <StoryShowcase direction="row">
      {sizes.map(size => (
        <StorySection key={size} title={`Size ${size}`} align="center">
          <StoryLabel>Outline</StoryLabel>
          <MyComponent size={size} variant="outline" />
        </StorySection>
      ))}
    </StoryShowcase>
  ),
};
```

## Table cell stories

When you need to add a new table cell to Storybook, you must update
`frontend/components/stories/table/cells-mock.tsx` to display the new cell.

## External Links

[Storybook Radiant Portal](https://radiant-network.github.io/radiant-portal)
