# ShadCN
Shadcn allow us to quickly generate some basic component. Our current theme use [New York Style](https://www.shadcndesign.com/blog/difference-between-default-and-new-york-style-in-shadcn-ui).

## When and how to create a new component with ShadCN
If a new basic component is requested, it must be created with shadcn's cli tools. See Figma's workflow for more informations.

1. Check [Shadcn component list](https://www.shadcndesign.com/components)
2. Read the shadcn documentation to install the new component. The command must be executed inside the `components` folder.
```shell
npx shadcn@latest add accordion
```
3. A new shadcn will be added inside `components/base/ui` folder.

## Don't override and existing component
A component created with shadcn can be modified to fit our needs. So if a component already exist, don't use shadcn cli tools, it will override the component. 
