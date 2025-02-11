# Components Folder Structure


## Summary

This naming structure is a synthesis of:

- Atomic Design for its conceptual hierarchy.
- Component-Driven Development for its practical focus on reusability and isolation.
- Design System Practices from real-world UI libraries.

Why This Structure
- Scalability: Easy to add new components in the correct category.
- Discoverability: Clear organization makes it easier for teammates to find and reuse components.
- Separation of Concerns: Keeps base components and feature-specific components separate to avoid coupling.

## `base/`
**Description:**
Contains foundational, reusable, and stateless components. These are the "atoms" of the application, representing single UI elements like buttons, inputs, or icons.
shadcd components should be put here.


**Examples:**
- `BaseButton.jsx`
- `BaseInput.jsx`
- `BaseIcon.jsx`
- `Card.jsx`
- `Dropdown.jsx`
- `Modal.jsx`

### To add a components

1. go to the `components/` directory
2. run `make shadcn-add COMPONENT_NAME`
or 
2. run `npx shadcn@latest add COMPONENT_NAME` 

---

## `feature/`
**Description:**
Includes higher-level components that often have business logic or are tied to specific application features. These "organisms" serve as building blocks for feature-specific functionality.

**Examples:**
- `UserProfile.jsx`
- `ShoppingCart.jsx`
- `ProductList.jsx`

---

## `utils/`
**Description:**
Contains utility components that assist with layout, state management, or conditional rendering. These components are often helpers rather than UI elements.

**Examples:**
- `ConditionalRender.jsx`
- `ErrorBoundary.jsx`

---

## `layout/`
**Description:**
To validate if necessary or not with Tailwindcss.

Stores global layout components that define the structure of pages or sections in the application. These components usually handle overall positioning and layout.

**Examples:**
- `Header.jsx`
- `Footer.jsx`
- `Sidebar.jsx`

## `models/`
**Description:**
Models, types and headless features

**Examples:**
- `QueryBuilder/` Directory containing components for building complex queries, their types and models.
