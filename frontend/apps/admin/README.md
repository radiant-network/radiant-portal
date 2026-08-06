# Admin (page application)

Tenant Admin UI — manage users, organizations, and roles within a tenant.

**Status:** Phase 2 in-stack build, **running on mock data** (`src/mock/`) until the backend
`can_manage_users` / `can_manage_orgs` / `can_manage_roles` endpoints land. Not yet wired to a
portal route — screens are validated in Storybook (`components/stories/admin/`).

## Structure

- `src/mock/` — mock data model + seed (users, roles, organizations, tenant).
- `src/components/` — admin shell (layout, sidebar/section nav).
- `src/features/users/` — the Users section (table, filters, cells).

Sections in scope so far: **Users** (list, read-only). Organizations and Roles & Permissions are
placeholders in the sidebar until their increments.
