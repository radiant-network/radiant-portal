import { useState } from 'react';

import { ASSIGNABLE_ROLES } from '../../mock/data';
import type { Role } from '../../mock/types';

import RoleBox from './role-box';
import type { RoleAssignmentForm } from './user-form.types';
import ViewPermissionsDialog from './view-permissions-dialog';

type RoleCheckboxGroupProps = {
  /** Current assignments (excludes the implicit baseline `member`). */
  value: RoleAssignmentForm[];
  onChange: (next: RoleAssignmentForm[]) => void;
};

/**
 * The "Assign roles" box group: one selectable box per assignable role (all except the implicit
 * `member`). Checking an org-scoped role reveals its inline org picker. Owns the View-permissions modal.
 */
export default function RoleCheckboxGroup({ value, onChange }: RoleCheckboxGroupProps) {
  const [permissionsRole, setPermissionsRole] = useState<Role | null>(null);

  const toggleRole = (role: Role, checked: boolean) => {
    if (checked) {
      onChange([...value, { roleCode: role.code, orgCodes: [] }]);
    } else {
      onChange(value.filter(assignment => assignment.roleCode !== role.code));
    }
  };

  const setOrgCodes = (roleCode: string, orgCodes: string[]) => {
    onChange(value.map(assignment => (assignment.roleCode === roleCode ? { ...assignment, orgCodes } : assignment)));
  };

  return (
    <div className="flex flex-col gap-3">
      {ASSIGNABLE_ROLES.map(role => {
        const assignment = value.find(a => a.roleCode === role.code);
        return (
          <RoleBox
            key={role.code}
            role={role}
            checked={!!assignment}
            orgCodes={assignment?.orgCodes ?? []}
            onToggle={checked => toggleRole(role, checked)}
            onOrgCodesChange={orgCodes => setOrgCodes(role.code, orgCodes)}
            onViewPermissions={() => setPermissionsRole(role)}
          />
        );
      })}
      <ViewPermissionsDialog
        role={permissionsRole}
        open={!!permissionsRole}
        onOpenChange={open => !open && setPermissionsRole(null)}
      />
    </div>
  );
}
