# Accessibility

Accessibility is checked in two places: ESLint, while you write the code, and Storybook, on the rendered component.

## ESLint

`frontend/.eslintrc.cjs` enables the `plugin:jsx-a11y/strict` preset. It runs in the editor and on every commit (`lint-staged`), on the staged files only.

Our wrappers are mapped to the native element they render (`settings['jsx-a11y'].components`), so the rules check them too:

| Component            | Checked as          |
| -------------------- | ------------------- |
| `Button`             | `button`            |
| `Input`, `Textarea`  | `input`, `textarea` |
| `Label`              | `label`             |
| `Link`, `AnchorLink` | `a`                 |

- `AnchorLink component="button"` is checked as a button (`polymorphicPropName`).
- React Router's `Link` is a valid link with `to` instead of `href`.

When you add a wrapper around a native interactive element, add it to this mapping.

### Disabling a rule

Fix the code first. Disable a rule only when the code is right and the rule can't see it, always on one line and with a reason after `--`:

```tsx
// eslint-disable-next-line jsx-a11y/no-autofocus -- focus moves into the calendar the user just opened
```

Accepted reasons so far:

- a mouse shortcut doubled by a keyboard-accessible control (clicking a row toggles its checkbox);
- focus moved on purpose into what the user just opened (popover, calendar, edit mode);
- link text injected by `<Trans components={{ … }}>`;
- a tooltip trigger made focusable so keyboard users can open it.

## Storybook

`@storybook/addon-a11y` runs axe on every story. Open the **Accessibility** tab of the bottom panel to see the violations, passes and incomplete checks.

The addon runs in `todo` mode (`parameters.a11y.test` in `.storybook/preview.tsx`): violations are reported but don't fail. Once a component is fixed, switch its stories to error mode so it can't regress:

```tsx
const meta = {
  title: 'Components/…',
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof MyComponent>;
```

## Writing accessible components

- Use the native element for the job: `<button>` for an action, `<a href>` / `Link to` for navigation. Avoid `onClick` on a `div` or `span`.
- Every interactive element has an accessible name: visible text, `aria-label` or `sr-only` text. A tooltip does not name a button.
- Everything available on hover is also available on keyboard focus.
- Accessible names go through i18n under `a11y.<component>.<action>`, in `translations/common/{en,fr}.json`:

  ```json
  "a11y": {
    "clingen_cell": { "open": "Open in ClinGen (new tab)" }
  }
  ```

### Icon-only buttons

An icon alone gives a button no name: Lucide icons are `aria-hidden` and a tooltip is not a name. Add an `aria-label`:

```tsx
<Button iconOnly variant="ghost" aria-label={t('a11y.list_item.delete')} onClick={onDelete}>
  <TrashIcon />
</Button>
```

- The label says what the button does, not why it is disabled.
- When the tooltip already says it and changes with the state, reuse the same expression rather than adding a key:
  `aria-label={hasNotes ? t('notes.variant.tooltip.view') : t('notes.variant.tooltip.add')}`.
- When the button shows text (a count, a language code, a value), the label contains it: `"{{count}} comments"`, `"Switch to French (FR)"`.
- Repeated in every row? Put the row's value in the label: `"Add {{symbol}} to the query"`.
- An icon link styled as a button is a single element, never `<Link><Button /></Link>`:

  ```tsx
  <Button asChild iconOnly size="xs" variant="ghost">
    <Link to={href} aria-label={t('a11y.classification_section.open', { title })}>
      <ArrowUpRight />
    </Link>
  </Button>
  ```

- A wrapper that receives props from its caller sets its default `aria-label` before `{...props}`, so the caller can override it.

### Keyboard access

**Actions shown on hover.** Never hide a focusable control with `hidden` (`display: none`): Tab skips it. Collapse it instead and reveal it on hover or keyboard focus:

```tsx
'w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 group-has-[:focus-visible]:w-auto group-has-[:focus-visible]:opacity-100';
```

- Use `group-has-[:focus-visible]`, not `group-focus-within`: a dialog that autofocuses its first row on open would otherwise reveal that row's actions.
- When the hidden element is a container, switch it to `overflow-visible` once revealed, or it clips the focus ring of the buttons inside.

**No interactive element inside another.** A button or link must not contain another button or link. For a clickable row or header that also holds links or buttons (accordion headers, the query builder header), stretch the trigger instead:

```tsx
<div className="relative flex items-center">
  <AccordionTrigger className="w-auto after:absolute after:inset-0">{name}</AccordionTrigger>
  <Button asChild className="relative z-10">
    …
  </Button>
</div>
```

The whole row stays clickable through the trigger's `::after`; the other controls sit above it with `relative z-10`.

**Composite widgets use the arrow keys.** Tabs (`TabsNav`, Radix `Tabs`), menus and radio groups are a single Tab stop: Tab reaches the active item, the arrow keys move between items, Home / End jump to the first / last one.

**A `Select` only holds options.** Its content is navigated with the arrows between `SelectItem`s and Tab is blocked, so an extra button inside (e.g. "Manage filters") can't be reached. Use a `DropdownMenu` when a list mixes choices and actions.

**Focus ring and `overflow-hidden`.** The 3px ring is drawn outside the element: a parent with `overflow-hidden` clips it when the element touches its edge. Give the parent a little padding (`pl-1 -ml-1`).
