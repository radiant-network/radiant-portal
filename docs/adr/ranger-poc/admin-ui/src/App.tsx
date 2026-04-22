import { useEffect, useState, useCallback } from "react";
import Keycloak from "keycloak-js";
import {
  setToken, fetchMyTenants, fetchAdminTenants, fetchPatients,
  fetchRoles, fetchActions, fetchUsers, fetchOrgs, grantOrgRole, revokeOrgRole,
  grantTenantRole, revokeTenantRole, createRole, updateRole, deleteRole,
} from "./api";
import type { Patient, Role, User, Org } from "./api";

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KC_URL || "http://localhost:8180",
  realm: "starrocks",
  clientId: "starrocks",
});

type Page = "patients" | "admin";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState<Page>("patients");
  const [allTenants, setAllTenants] = useState<string[]>([]);
  const [adminTenants, setAdminTenants] = useState<string[]>([]);
  const [tenant, setTenant] = useState("");

  useEffect(() => {
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((auth) => {
        if (auth && keycloak.token) {
          setToken(keycloak.token);
          setAuthenticated(true);
          setUsername(keycloak.tokenParsed?.preferred_username || "");
          setInterval(() => {
            keycloak.updateToken(30).then((refreshed) => {
              if (refreshed && keycloak.token) setToken(keycloak.token);
            });
          }, 10000);
          Promise.all([fetchMyTenants(), fetchAdminTenants().catch(() => [])]).then(
            ([all, admin]) => {
              setAllTenants(all || []);
              setAdminTenants(admin || []);
              if (all?.length) setTenant(all[0]);
            }
          );
        }
      })
      .catch(() => setError("Authentication failed"));
  }, []);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!authenticated) return <div className="flex items-center justify-center h-screen text-gray-500">Authenticating...</div>;
  if (!allTenants.length) return <div className="p-8 text-gray-600">No tenants available.</div>;
  if (!tenant) return null;

  const isAdminTenant = adminTenants.includes(tenant);

  // If on admin page but switched to non-admin tenant, go back to patients
  if (page === "admin" && !isAdminTenant) setPage("patients");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-blue-700">Radiant</h1>
            <nav className="flex gap-1">
              <NavTab label="Patients" active={page === "patients"} onClick={() => setPage("patients")} />
              {isAdminTenant && (
                <NavTab label="Admin" active={page === "admin"} onClick={() => setPage("admin")} />
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <TenantSwitcher tenants={allTenants} value={tenant} onChange={setTenant} />
            <div className="flex items-center gap-3 pl-4 border-l">
              <span className="text-sm text-gray-600">{username}</span>
              <button onClick={() => keycloak.logout()}
                className="text-sm text-gray-400 hover:text-gray-600">Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        {page === "patients" ? (
          <PatientsPage tenant={tenant} />
        ) : (
          <AdminPage tenant={tenant} />
        )}
      </main>
    </div>
  );
}

function NavTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
        active ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}>
      {label}
    </button>
  );
}

function TenantSwitcher({ tenants, value, onChange }: { tenants: string[]; value: string; onChange: (v: string) => void }) {
  if (tenants.length === 1) {
    return <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded">{value}</span>;
  }
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="text-sm font-medium bg-gray-100 border-none rounded px-3 py-1 cursor-pointer">
      {tenants.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
    </select>
  );
}

// ==========================================================================
// Patients Page
// ==========================================================================

function PatientsPage({ tenant }: { tenant: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchPatients(tenant)
      .then(setPatients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tenant]);

  if (loading) return <p className="text-gray-500">Loading patients...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Patients</h2>
        <span className="text-sm text-gray-400">{patients.length} records</span>
      </div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">ID</th>
              <th className="text-left p-3 font-medium text-gray-600">First Name</th>
              <th className="text-left p-3 font-medium text-gray-600">Last Name</th>
              <th className="text-left p-3 font-medium text-gray-600">MRN</th>
              <th className="text-left p-3 font-medium text-gray-600">Date of Birth</th>
              <th className="text-left p-3 font-medium text-gray-600">Organization</th>
              <th className="text-left p-3 font-medium text-gray-600">Diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-3 text-gray-500">{p.id}</td>
                <td className={`p-3 ${p.first_name === "***" ? "text-gray-300 italic" : ""}`}>{p.first_name}</td>
                <td className={`p-3 ${p.last_name === "***" ? "text-gray-300 italic" : ""}`}>{p.last_name}</td>
                <td className={`p-3 font-mono text-xs ${p.mrn === "***" ? "text-gray-300 italic" : ""}`}>{p.mrn}</td>
                <td className={`p-3 ${p.date_of_birth?.endsWith("-01-01") && p.first_name === "***" ? "text-gray-300 italic" : ""}`}>{p.date_of_birth}</td>
                <td className="p-3"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{p.org_id}</span></td>
                <td className="p-3 text-gray-600">{p.diagnosis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================================================
// Admin Page (Roles + Users)
// ==========================================================================

function AdminPage({ tenant }: { tenant: string }) {
  const [tab, setTab] = useState<"users" | "roles">("users");
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Administration</h2>
        <div className="flex gap-1 bg-gray-100 rounded p-0.5">
          <button onClick={() => setTab("users")}
            className={`px-3 py-1 rounded text-xs font-medium ${tab === "users" ? "bg-white shadow text-gray-800" : "text-gray-500"}`}>
            Users
          </button>
          <button onClick={() => setTab("roles")}
            className={`px-3 py-1 rounded text-xs font-medium ${tab === "roles" ? "bg-white shadow text-gray-800" : "text-gray-500"}`}>
            Roles
          </button>
        </div>
      </div>
      {tab === "users" ? <UsersPanel tenant={tenant} /> : <RolesPanel tenant={tenant} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Roles panel (CRUD)
// ---------------------------------------------------------------------------

function RolesPanel({ tenant }: { tenant: string }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allActions, setAllActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    Promise.all([fetchRoles(tenant), fetchActions(tenant)])
      .then(([r, a]) => { setRoles(r || []); setAllActions((a || []).map((x) => x.action_id)); })
      .finally(() => setLoading(false));
  }, [tenant]);

  useEffect(() => { reload(); }, [reload]);

  const handleCreate = async (data: { role_id: string; role_name: string; scope: string; description: string; actions: string[] }) => {
    try { await createRole(tenant, data); setMsg(`Created ${data.role_id}`); setCreating(false); reload(); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
  };
  const handleUpdate = async (data: { role_id: string; role_name: string; scope: string; description: string; actions: string[] }) => {
    try { await updateRole(tenant, data); setMsg(`Updated ${data.role_id}`); setEditing(null); reload(); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
  };
  const handleDelete = async (roleId: string) => {
    if (!confirm(`Delete role "${roleId}"? This will also remove all user assignments for this role.`)) return;
    try { await deleteRole(tenant, roleId); setMsg(`Deleted ${roleId}`); reload(); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (creating) return <RoleForm allActions={allActions} onSave={handleCreate} onCancel={() => setCreating(false)} />;
  if (editing) return <RoleForm role={editing} allActions={allActions} onSave={handleUpdate} onCancel={() => setEditing(null)} />;

  const orgRoles = roles.filter((r) => r.scope === "org");
  const tenantRoles = roles.filter((r) => r.scope === "tenant");

  return (
    <div className="space-y-6">
      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-2 rounded flex justify-between">
          {msg}<button onClick={() => setMsg("")} className="text-green-600">x</button>
        </div>
      )}
      <div className="flex justify-end">
        <button onClick={() => setCreating(true)} className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700">+ New Role</button>
      </div>
      <RoleTable title="Org-scoped Roles" roles={orgRoles} onEdit={setEditing} onDelete={handleDelete} />
      <RoleTable title="Tenant-scoped Roles" roles={tenantRoles} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}

function RoleTable({ title, roles, onEdit, onDelete }: { title: string; roles: Role[]; onEdit: (r: Role) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-2">{title}</h3>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Role</th>
              <th className="text-left p-3 font-medium text-gray-600">Actions</th>
              <th className="text-right p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.role_id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">{r.role_id}</span>
                  {r.description && <p className="text-xs text-gray-400 mt-0.5">{r.description}</p>}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {r.actions.map((a) => (
                      <span key={a} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">{a}</span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => onEdit(r)} className="text-xs text-blue-600 hover:underline mr-2">edit</button>
                  <button onClick={() => onDelete(r.role_id)} className="text-xs text-red-500 hover:underline">delete</button>
                </td>
              </tr>
            ))}
            {!roles.length && <tr><td colSpan={3} className="p-3 text-gray-400 text-center">No roles</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleForm({ role, allActions, onSave, onCancel }: {
  role?: Role; allActions: string[];
  onSave: (data: { role_id: string; role_name: string; scope: string; description: string; actions: string[] }) => void;
  onCancel: () => void;
}) {
  const isEdit = !!role;
  const [roleId, setRoleId] = useState(role?.role_id || "");
  const [roleName, setRoleName] = useState(role?.role_name || "");
  const [scope, setScope] = useState(role?.scope || "org");
  const [description, setDescription] = useState(role?.description || "");
  const [selected, setSelected] = useState<Set<string>>(new Set(role?.actions || []));

  const toggle = (a: string) => {
    const next = new Set(selected);
    if (next.has(a)) next.delete(a); else next.add(a);
    setSelected(next);
  };

  return (
    <div className="bg-white border rounded-lg p-6 max-w-2xl">
      <h3 className="text-base font-semibold mb-4">{isEdit ? `Edit: ${roleId}` : "New Role"}</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Role ID</label>
            <input value={roleId} onChange={(e) => setRoleId(e.target.value)} disabled={isEdit}
              className="w-full border rounded px-2 py-1.5 text-sm disabled:bg-gray-100" placeholder="e.g. geneticist" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
            <input value={roleName} onChange={(e) => setRoleName(e.target.value)}
              className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. Geneticist" />
          </div>
        </div>
        {!isEdit && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Scope</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)} className="border rounded px-2 py-1.5 text-sm">
              <option value="org">Organization</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1.5 text-sm" placeholder="What this role does" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Actions</label>
          <div className="flex flex-wrap gap-1.5 p-3 border rounded bg-gray-50 max-h-48 overflow-y-auto">
            {allActions.map((a) => (
              <button key={a} type="button" onClick={() => toggle(a)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  selected.has(a) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}>{a}</button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{selected.size} action{selected.size !== 1 ? "s" : ""} selected</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => onSave({ role_id: roleId, role_name: roleName, scope, description, actions: Array.from(selected) })}
          disabled={!roleId || !roleName}
          className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
          {isEdit ? "Save Changes" : "Create Role"}
        </button>
        <button onClick={onCancel} className="text-sm text-gray-500 px-4 py-1.5 hover:text-gray-700">Cancel</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Users panel
// ---------------------------------------------------------------------------

function UsersPanel({ tenant }: { tenant: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    Promise.all([fetchUsers(tenant), fetchRoles(tenant), fetchOrgs(tenant)])
      .then(([u, r, o]) => { setUsers(u || []); setRoles(r || []); setOrgs(o || []); })
      .finally(() => setLoading(false));
  }, [tenant]);

  useEffect(() => { reload(); }, [reload]);

  const orgRoleIds = roles.filter((r) => r.scope === "org").map((r) => r.role_id);
  const tenantRoleIds = roles.filter((r) => r.scope === "tenant").map((r) => r.role_id);

  const handleGrantOrg = async (username: string, orgId: string, roleId: string) => {
    try { await grantOrgRole(tenant, username, orgId, roleId); setMsg(`Granted ${roleId} at ${orgId} to ${username}`); reload(); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
  };
  const handleRevokeOrg = async (username: string, orgId: string, roleId: string) => {
    try { await revokeOrgRole(tenant, username, orgId, roleId); setMsg(`Revoked ${roleId} at ${orgId} from ${username}`); reload(); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
  };
  const handleGrantTenant = async (username: string, roleId: string) => {
    try { await grantTenantRole(tenant, username, roleId); setMsg(`Granted ${roleId} to ${username}`); reload(); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
  };
  const handleRevokeTenant = async (username: string, roleId: string) => {
    try { await revokeTenantRole(tenant, username, roleId); setMsg(`Revoked ${roleId} from ${username}`); reload(); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-3">
      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-2 rounded flex justify-between">
          {msg}
          <button onClick={() => setMsg("")} className="text-green-600 hover:text-green-800">x</button>
        </div>
      )}
      {users.map((user) => (
        <UserCard key={user.username} user={user} orgs={orgs}
          orgRoleIds={orgRoleIds} tenantRoleIds={tenantRoleIds}
          onGrantOrg={handleGrantOrg} onRevokeOrg={handleRevokeOrg}
          onGrantTenant={handleGrantTenant} onRevokeTenant={handleRevokeTenant} />
      ))}
    </div>
  );
}

function UserCard({ user, orgs, orgRoleIds, tenantRoleIds, onGrantOrg, onRevokeOrg, onGrantTenant, onRevokeTenant }: {
  user: User; orgs: Org[]; orgRoleIds: string[]; tenantRoleIds: string[];
  onGrantOrg: (u: string, o: string, r: string) => void;
  onRevokeOrg: (u: string, o: string, r: string) => void;
  onGrantTenant: (u: string, r: string) => void;
  onRevokeTenant: (u: string, r: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<"org" | "tenant">("org");
  const [addOrg, setAddOrg] = useState(orgs[0]?.org_id || "");
  const [addRole, setAddRole] = useState("");
  const roleOptions = addType === "org" ? orgRoleIds : tenantRoleIds;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{user.username}</h3>
        <button onClick={() => setShowAdd(!showAdd)}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
          {showAdd ? "Cancel" : "+ Assign Role"}
        </button>
      </div>
      {showAdd && (
        <div className="mb-3 p-3 bg-gray-50 rounded border flex gap-2 items-center text-sm">
          <select value={addType} onChange={(e) => { setAddType(e.target.value as any); setAddRole(""); }} className="border rounded px-2 py-1">
            <option value="org">Org Role</option>
            <option value="tenant">Tenant Role</option>
          </select>
          {addType === "org" && (
            <select value={addOrg} onChange={(e) => setAddOrg(e.target.value)} className="border rounded px-2 py-1">
              <option value="*">* (all orgs)</option>
              {orgs.map((o) => <option key={o.org_id} value={o.org_id}>{o.org_id}</option>)}
            </select>
          )}
          <select value={addRole} onChange={(e) => setAddRole(e.target.value)} className="border rounded px-2 py-1">
            <option value="">-- role --</option>
            {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button disabled={!addRole} onClick={() => {
            if (addType === "org") onGrantOrg(user.username, addOrg, addRole);
            else onGrantTenant(user.username, addRole);
            setShowAdd(false);
          }} className="bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50 hover:bg-green-700">Grant</button>
        </div>
      )}
      <div className="space-y-1 text-sm">
        {user.tenant_roles?.map((tr) => (
          <div key={`t-${tr.role_id}`} className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded">{tr.role_id}</span>
            <span className="text-gray-300 text-xs">(tenant)</span>
            <button onClick={() => onRevokeTenant(user.username, tr.role_id)} className="text-red-400 text-xs hover:text-red-600 ml-auto">revoke</button>
          </div>
        ))}
        {user.org_roles?.map((or) => (
          <div key={`o-${or.org_id}-${or.role_id}`} className="flex items-center gap-2">
            <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded">{or.role_id}</span>
            <span className="text-gray-400">@</span>
            <span className="text-gray-500">{or.org_id === "*" ? "* (all orgs)" : or.org_id}</span>
            <span className="text-gray-300 text-xs">(org)</span>
            <button onClick={() => onRevokeOrg(user.username, or.org_id, or.role_id)} className="text-red-400 text-xs hover:text-red-600 ml-auto">revoke</button>
          </div>
        ))}
        {!user.tenant_roles?.length && !user.org_roles?.length && (
          <span className="text-gray-300 text-xs italic">No roles</span>
        )}
      </div>
    </div>
  );
}
