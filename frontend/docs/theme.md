# Theme Guide

## Figma Workflow

- **Ready for Development**: In Figma, components marked as `Ready for dev` (left sidebar) are ready to be implemented in Radiant.
- **Component Types & Where to Add**:
  - **New, basic UI kit component**: Use [shadcn CLI](./shadcn.md).
  - **Custom, reusable across pages**: Add to `components/base`.
  - **Composed, used across project**: Add to `components/feature`.
  - **New page**: Create a [Page Application](./create-an-application.md).
  - **Feature unique to a Page Application**: Add to `apps/%page_application%/components/feature`. See [Create Application documentation](./create-an-application.md).

**After Coding the Component:**

1. Add a Storybook entry for the new component.
2. Wait for the Storybook build to succeed.
3. Check your component in [Radiant's Storybook](https://radiant-network.github.io/radiant-portal/).
4. In Figma, click `Mark as completed`.
5. Move your Jira task to QA.
6. Tag the UI/UX designer in Jira (and optionally notify via Slack) for validation.

---

## Figma Variables & Tailwind

- Figma variables should match Tailwind spacing.
  - Example: `--spacing-2` in Figma = `gap-2` in Tailwind.

**Figma:**

```css
display: flex;
align-items: center;
gap: var(--spacing-2, 8px);
```

**Tailwind:**

```tsx
<div className="flex items-center gap-2">
```

---

## Shadcn/Tailwind Stacks

- The global stylesheet is `@/themes/tailwind.base.css`.

### Adding New CSS Variables

- **Colors**: Use oklch values (ask Lucas if unsure).
- **Global variables**: Define in `themes/tailwind.base.css` under `:root` and `.dark`.
- **Portal-specific variables**: Define in `themes/%portal%/theme.css` and reference them in `tailwind.base.css`.

### Making Variables Accessible via Tailwind ClassNames

1. Add the variable in the `@theme` and `@layer theme` sections of `tailwind.base.css`:
   ```css
   /* themes/tailwind.base.css */
   @theme inline {
     --color-custom-color: var(--portal-specific-color);
   }
   ```
2. Use in Tailwind:
   ```tsx
   <div className="bg-custom-color" />
   ```

---

## Overriding Global Classes

- To override Tailwind or global styles for a specific portal, edit `portals/%portal%/app/app.css`:

```css
/* portals/radiant/app/app.css */
@import '@styles/theme.css';
@import '@styles/tailwind.css';

html,
body {
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;

  @media (prefers-color-scheme: light) {
    color-scheme: light;
  }
}
```
