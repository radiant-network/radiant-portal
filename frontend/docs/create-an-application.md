# Create a new Page Application
A page application is an unique page in our infrastructure.

# CLI
Execute `cli/create-application/create-app.sh` to create a new page application.

- The application name must be in kebab-case. e.g. `variant`, `file-archive`
- You must use node version v.20.18.0

# Using the new Page Application
## Updating Radiant's tsconfig.json file
Once the CLI has been executed, a new folder should appear in `frontend/apps/%my-new-application%`. To be used by our project, this folder must been linked in `frontend/portals/radiant/tsconfig.json` inside `path`

```json
"paths": {
	"@/config/*": ["./config/*"],
	"@/api/*": ["../../api/*"],
	"@/utils/*": ["../../utils/*"],
	"@/components/*": ["../../components/*"],
	"@/base/*": ["../../components/base/*"],
	"@/lib/*": ["../../components/lib/*"],
	"@/hooks/*": ["../../components/hooks/*"],
	"@assets/*": ["../../themes/radiant/assets/*"],
	"variant/*": ["../../apps/variant/src/*"],
	"file-archive/*": ["../../apps/file-archive/src/*"],
	"my-new-application/*": ["../../apps/my-new-application/src/*"], /* My New Application */
	"~/*": ["./app/*"],
	"react": ["./node_modules/@types/react"]
},
```

## Settings up Radiant Portal
Portals manage the loading of the all application pages. It works like a standard react application.

To make a new Page Application available, it should be added to `frontend/portals/radiant/app/routes.ts`. In this example, we take in account that `my-new-application` display a list. 

```typescript
// frontend/portals/radiant/app/routes.ts
route('variants/entity/:locusId', './routes/variants/entity.tsx'),
route('case/', './routes/cases/list.tsx'),
route('my-new-application/', './routes/my-new-application/list.tsx'), // <-- New route 
```

`list.tsx` is created inside `routes/my-new-application`. It loads the page application

```typescript
// frontend/portals/radiant/app/routes/my-new-application/list.tsx
import MyNewApplication from 'my-new-application/App';
const VMyNewApplication = () => {
	return <MyNewApplication />;
};
export default VMyNewApplication;
```

If the page need to be added to the main navigation bar, `protected-layout.tsx` must be edited.

```typescript
links={[
	{
		title: t('main_navbar.links.dashboard'),
		icon: <LayoutDashboardIcon />,
	},
	{
		title: t('main_navbar.links.cases'),
		icon: <FolderIcon />,
		onClick: () => navigate('/case-exploration'),
		active: pathname === '/case-exploration'
	},
	{
		title: t('main_navbar.links.cases'),
		icon: <FolderIcon />,
		onClick: () => navigate('/my-new-application'),
		active: pathname === '/my-new-application'
	},
]}
```

# Page Application folder's structure

- `components`: composition of basic component e.g. `table`, `tab` etc.
- `features`: unique component to this page application e.g. `table-settings`, `cells`
