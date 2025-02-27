# React Router + Tailwind CSS Coding Guidelines

## Project Architecture and Structure

This document outlines the structure and purpose of the main directories in this repository. It explains the role of each directory and how they contribute to the overall functionality of the project.

The project is structure as a workspace. There is no need to compile and ship npm packages to use the components in the workspace. The components are imported directly from the source code.

Instead of working by portals, now we work by applications and we have to make sure it works accross all the portals.

---

## Project Structure

### Directory Organization

```
frontend/
├── apps/                # Full applications for a domain (e.g., Variant, Prescription)
├── components/
│   ├── base/           # Simple, first level Reusable components
|   │   ├──ui           # Shadcn imported primitive components (keep name lowercase so that shadcn import doesn't re-import)
│   ├── features/       # Feature-specific components
│   ├── layout/         # Layout components
│   └── models/         # Models, types and headless features
├── docs/                # General documentation
├── portals/             #
│   ├── radiant/        # Portal build. Get a configuration an build a portal (e.g., Radiant, kf, include)
├── storybook/           #
├── themes/              #
│   ├── themesX/        # Theme-specific assets
│   |   └── assets/     #
│   utils/              # Shared utils
└── types/               # TypeScript types/interfaces
```

---

### 1. **Apps**

The `Apps` directory contains full applications designed to serve specific business domains.
Each application is a complete unit, including pages and modal dialogs specific to its purpose.

It does not contain navigation, site layout. Only the core features of the application.

#### Examples:

- **Variant**: Application related to variant exploration.
- **Prescription**: Handles prescription-related functionalities.
- **Community**: Manages community-specific features.

#### Key Characteristics:

- Combines pages and modals for cohesive user flows for a specific domain.
- Leverages components from the `Components` directory for reusable building blocks.

---

### 2. **Components**

The `Components` directory holds all basic to advanced UI components required to build applications. These components are categorized into generic and custom components.

#### Types of Components:

- **Generic Components**: Built using [shadcn](https://shadcn.dev), leveraging pre-made, highly customizable components.
- **Custom Components**: Created with React and TailwindCSS for unique design and behavior tailored to application needs.

#### Key Features:

- Encourages reusability across multiple applications.
- Provides a shared library of consistent UI elements.

[Read More](../components/README.md)

---

### 3. **Portals**

The `Portals/radiant` directory contains the layout and setup for portals

This is the structure for generating different portals (e.g., "Radiant", "kf", etc).

#### Strategy:

- Each portal is a separate build that can be customized with different themes and configurations.
- Each Build is specified in the package.json file and can be run with `npm|bun build:[portal_name]`.

#### Configuragion:

- Each portal has its own configuration file that specifies the theme, environment, and other settings.
- The configuration file is used to generate the portal with the correct settings.
The configurations files are located in the `config` directory.

The way it work, a configuration file is set to a global Variable name __PROJECT__ in the vite configuration file and set at compile time.
In @/components/utils/config.ts, the configuration is imported and used to set the theme and other settings as a Provider.

#### Functionality:

- Uses `react-router` for navigation and routing.
- Capable of generating multiple portals based on different themes and environment configurations during the build process.

---

### 4. **Themes**

The `Themes` directory houses theme-related assets such as images and TailwindCSS configurations. These themes are used to style the portals and applications, ensuring a consistent look and feel across the project.

#### Contents:

- **Images**: Logos, backgrounds, and other visual assets.
- **CSS**: TailwindCSS configurations for styling components and layouts.

---

### 5. **Storybook**

The `Storybook` directory contains a setup for testing and demonstrating components. It allows developers to preview individual components or groups of components in isolation.

#### Capabilities:

- Select and test components with different themes applied.
- Serves as a living documentation for the component library.
