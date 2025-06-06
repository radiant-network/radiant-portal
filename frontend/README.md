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
git clone git@github.com:radiant-network/radiant-portal.git
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

you can replace radiant with specific portal name

### Generate the API client

Go to the root of the repo in the backend folder and run the following command:

```bash
openapi-generator-cli generate -i ./backend/docs/swagger.yaml -g typescript-axios -o ./frontend/api

```

## Contribution
[Contribution](./docs/contribution.md)

## Project Directory Structure

[Project Structure Documentation](./docs/project-structure.md)

## Code Conventions

[Code Convention Documentation](./docs/code-conventions.md)

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
