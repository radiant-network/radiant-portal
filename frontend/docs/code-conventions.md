# Naming Conventions

## Files and Folders
- Use PascalCase for component files: `UserProfile.tsx`
- Use kebab-case for non-component files: `auth-utils.ts`
- Use plural for folder names: `components/`, `utils/`
- Name page components with "Page" suffix: `HomePage.tsx`, `UserProfilePage.tsx`
- Name layout components with "Layout" suffix: `MainLayout.tsx`

## Code

Source of thruth is the [ferlab code conventions](https://github.com/Ferlab-Ste-Justine/ferlab-ui/tree/master/packages/eslint-config) in eslint. Make sure it is up to date and active in your editor.

### Components
- Use PascalCase for component names: `UserProfile`, `NavigationBar`
- Use suffix to indicate component type:
  ```tsx
  // Pages
  export default function HomePage() {}

  // Layouts
  export default function DashboardLayout() {}

  // Features
  export default function UserProfileCard() {}
  ```

### Routes
- Use kebab-case for route paths: `/user-profile`, `/blog-posts`
- Group related routes in separate files
- Use descriptive names for route parameters: `userId` instead of `id`

## Coding Practices

### Component Structure
```tsx
// Import order
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

// Local imports
import { Button } from '@/components/common'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/date'

// Component definition
export default function UserProfilePage() {
  // Hooks first
  const navigate = useNavigate()
  const { user } = useAuth()

  // State/refs next
  const [isEditing, setIsEditing] = React.useState(false)

  // Derived values/computations
  const fullName = `${user.firstName} ${user.lastName}`

  // Event handlers
  const handleSubmit = () => {
    // ...
  }

  // JSX
  return (
    <div>
      {/* JSX content */}
    </div>
  )
}
```

### Tailwind CSS Best Practices

1. Component Organization
```tsx
// Prefer
<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
  {/* Content */}
</div>

// Avoid multiple className props or string concatenation
<div
  className={`
    flex
    items-center
    ${isActive ? 'bg-main-500' : 'bg-inactive-500'}
  `}
>
```

2. Extract Common Patterns
```tsx
// styles/common.js
export const cardStyles = "p-4 bg-white rounded-lg shadow-md"
export const buttonStyles = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
```

3. Use Semantic Class Groups
```tsx
// Group related utilities
<button className="
  /* Layout */
  flex items-center justify-center
  /* Spacing */
  px-4 py-2
  /* Colors use context color names */
  warning-bg primary-text secondary-border
  /* Interactive */
  hover:bg-main-600 focus:ring-2
">
```

### Route Definition Best Practices

```tsx
// routes/index.tsx
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
        loader: dashboardLoader,
      },
    ],
  },
])
```

### Error Handling
- Use error boundaries for route-level error handling
- Implement consistent error UI components
- Add proper loading states for async operations

```tsx
// components/common/ErrorBoundary.tsx
export function RouteErrorBoundary() {
  const error = useRouteError()

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-red-800">Something went wrong</h2>
      <p className="text-red-600">{error.message}</p>
    </div>
  )
}
```

### Performance Considerations
- Lazy load routes using `React.lazy()` and `Suspense`
- Implement proper loading states
- Use proper key props for lists
- Avoid inline styles and dynamic class generation
- Use memoization for expensive computations
- Optimize re-renders with `React.memo()`
- Use `useMemo()` for memoizing values
- Use `useCallback()` for memoizing functions
- Use `useEffect()` for side effects
- Use react new compile to auto use Memo and Callback

```tsx
// routes/index.tsx
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))

export const router = createBrowserRouter([
  {
    path: 'dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardPage />
      </Suspense>
    ),
  },
])
```

### Testing Guidelines

- Test files should be co-located with component files
- Use descriptive test names
- Test error states and loading states
- Only test business logic and side effects, not full flow

```tsx
// UserProfile.test.tsx
describe('UserProfile', () => {
  it('should display user information', () => {
    // ...
  })

  it('should handle navigation to edit page', () => {
    // ...
  })
})
```

Remember these guidelines are meant to be adapted to your specific needs while maintaining consistency across your project. Regular code reviews and team discussions can help refine and evolve these practices over time.


#### Links

- [kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case)
