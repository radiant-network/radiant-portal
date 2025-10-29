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

**Map figma color with Tailwind**

In figma, select your component and you can see colors in Inspect column. For each part of the component (background, foreground, button) you can see the Figma generic color name and an alpha number to define the opacity.
If you click on the three points you can see variable details and hover value to see View variable in collection icon button to map this figma color with tailwind color.
In this variable in collection table, you can see light and dark color to set your new css variables if it is necessary in `themes/tailwind.base.css` (see Shadcn/Tailwind Stacks section).
For alpha value, it's just needed to add the alpha value where the css variable is used.

Example: 
  - Figma `alert/warning` and `alpha/20`
  - Variable in collection `alert/warning` => `tailwind colors/yellow/400`
  - CSS variable `--color-alert-warning: var(--color-yellow-400);`
  - Component code `bg-alert-warning/20`

---

## Shadcn/Tailwind Stacks

- The global stylesheet is `@/themes/tailwind.base.css`.

### Radiant Custom Colors

We have a list of custom colors. The list is the following:

```css
amber, red, orange, yellow, lime, green, cyan, blue, violet, fuchsia and neutral.
```

\*Note: `neutral` is defined in the `themes/%portal%/theme.css` file since its portal specific.

These color variables will be defined in Figma as `--badge-[color]` and `--badge-[color]-foreground` due to limitation. The term badge is only the name we used in figma to defined these variables but it not related only to badge. For example, you will see something like this in Figma for the Alert component:

```css
background: var(--badge-red);
```

In the frontend it means you need to use the variable `--red` or in this case `bg-red` as the className.

\*IMPORTANT: in the frontend `--red` is the base color without any opacity change, but in Figma, `--badge-red` might have an opacity. DONT change the value of the variable `--red`. Instead add the opacity using tailwind modifiers like this:

```html
<div className="bg-red/20" />
```

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
   ```html
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
