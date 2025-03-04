# Development

## Getting Started

Before creating a new component, validate if there is already something a similar in shadcn. If not, you can create a new one.

[shadcn](https://ui.shadcn.com)

All shadcn components should be put in the `components/base/` directory.

### To add a components

1. go to the `components/` directory
2. run `make shadcn-add COMPONENT_NAME`

## Building different portals

Frontend is a workspace. It contains multiple projects that works together. To make them see each other and import each other

The portals are in the `portals/` directory. This is a single directory, radiant which is a builder for all the portals.

Each portal has its own configuration and build.

e.g.

### Dev build

To build kidsfirst portal

````bash

npm run dev:kf

    ```

### Production build with docker

```bash
# at the root of the frontend folder
make docker-build-kf
make docker-run-kf

make docker-build-radiant
make docker-run-radiant
````

### Storybook

To launch the storybook, from `components/`

```bash
npm run storybook:radiant
```
