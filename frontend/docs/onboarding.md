# Onboarding

## Prequequis

1. Follow the installation instructions from the Frontend's [README](./../README.md)
2. Read [Code Conventions](./code-conventions.md) before contributing.
3. Read [Project Structure](./project-structure.md) to understand the project structure (Applications, Components etc.).
4. Read [Components Structure](./components/README.md) to understand the components structure.
5. Ask for the `.env`

## How To ?

**I have an error with `@rollup/rollup-darwin-arm64` after installing the project?**

Sometimes after installing all workspaces, Frontend can be corrupted. You needs to delete `node_modules` and `package-lock.json` and re-install.

```shell
cd frontend
rm -rf node_modules package-lock.json && npm i
```



**How can I start the portal?**

You need to have a node version of at least `v20.18.0`. See [Node Version Manage](https://github.com/nvm-sh/nvm) to works with multiple node version on your environment.

From radiant's root folder

```shell
cd frontend/portals/radiant/
nvm use v20.18.0 
npm run dev:radiant
```



**How can I run storybook?**

From radiant's root folder

```shell
cd frontend/components/
npm run storybook:radiant
```

More info in [Storybook Documentation](./storybook.md)



**I need to add/edit a css variable?**

Check the [Theme and Figma documentation](./theme.md) to edit or update the theme of an application.



**What name should be my branch?**

A branch name should always contains the related JIRA. 

e.g. `feat/SJRA-000`



**How to normalize my commit message ?**

A commit should always be squashed before merging to prevent multiples commits for the same feature/fix. The format should be `type(subjet): SJRA-000 description`.

e.g.

```shell
feat(indicator): SJRA-000 update indicator color
fix(variant): SJRA-000 fix a typo
chore(frontend): SJRA-000 update axios
```



## Important links

[Project Structure Documentation](./docs/project-structure.md)

[Code Convention Documentation](./docs/code-conventions.md)

[shadcn convention documentation](./docs/shadcn.md)

[Create An Application](./docs/create-an-application.md)

[Form](./docs/form.md)

[Query-Builder](./docs/query-builder.md)

[Table](./docs/table.md)

