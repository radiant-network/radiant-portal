# Frontend 

## Getting Started

### Prerequisites

- Node.js
- Mac or Linux OS
- Make

### Installing

1. Clone the repository
2. Install the dependencies.
    Frontend is a workspace. It contains multiple projects that works together. To make them see each other and import each other
    you need to install the dependencies of the workspace at the root of the frontend folder first.
3. Run the the server

```bash
git clone git@github.com:Ferlab-Ste-Justine/radiant-portal.git
cd radiant-portal/frontend
npm install
cd portals/radiant
npm run dev
```

### Running server with docker

```bash
make docker-build-radiant
make docker-run-radiant
```

### Generate the API client

Go to the root of the repo in the backend folder and run the following command:
    
```bash 
openapi-generator-cli generate -i ./backend/docs/swagger.yaml -g typescript-axios -o ./frontend/api

```


## Project Directory Structure

This document outlines the structure and purpose of the main directories in this repository. It explains the role of each directory and how they contribute to the overall functionality of the project.

The project is structure as a workspace. There is no need to compile and ship npm packages to use the components in the workspace. The components are imported directly from the source code.

Instead of working by portals, now we work by applications and we have to make sure it works accross all the portals.

---

## Project Architecture and Structure

* frontend/
    * Apps
        * variant
        * App2
    * Components
    * Portals
       * radiant 
    * Themes
    * Storybook

---

### 1. **Apps**
The `Apps` directory contains full applications designed to serve specific business domains. 
Each application is a complete unit, including pages and modal dialogs specific to its purpose.

It does not contain navigation, site layout.

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

---

### 3. **Portals**
The `Portals` directory contains the layout and setup for portals, including the base structure for generating different portals (e.g., "Radiant"). 

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

---

## Development Workflow

1. **Components Development**: Build reusable components in the `Components` directory.
2. **Theme Integration**: Apply consistent styles using the `Themes` directory. Tailwindcss is used for styling.
3. **Application Assembly**: Use the `Apps` directory to create full applications by combining components and pages.
4. **Portal Customization**: Configure and generate multiple portals via the `Portals` directory. radiant should be a builder for the other portals. Different configuration should define what portals should be build.
5. **Testing and Documentation**: Use `Storybook` to test components in isolation and demonstrate their usage.

---

## Example Use Cases

1. **Adding a new component**:
   - Create the component in `Components`.
   - Test it in `Storybook` with multiple themes.
   - Integrate it into the relevant application or portal.

2. **Creating a new portal**:
   - Define the portal configuration `Portals` to be load at build time.
   - Apply a specific theme from the `Themes` directory.

3. **Theming an existing application**:
   - Add or modify theme assets in the `Themes` directory.
   - Test theme changes in `Storybook` and verify them in the application or portal.

---

This structure ensures modularity, reusability, and scalability across the project while maintaining consistency through shared components and themes.
