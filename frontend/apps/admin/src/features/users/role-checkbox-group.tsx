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
  /**
   * Roles the user can't *grant* here, mapped to the reason shown on the box (e.g. self-guard:
   * you can't grant yourself Tenant Admin). Grant-only — a role already assigned stays toggleable
   * so it can still be removed (subject to the sheet's last-admin veto).
   */
  lockGrantRoleCodes?: Record<string, string>;
};

/**
 * The "Assign roles" box group: one selectable box per assignable role (all except the implicit
 * `member`). Checking an org-scoped role reveals its inline org picker. Owns the View-permissions modal.
 */
export default function RoleCheckboxGroup({ value, onChange, lockGrantRoleCodes }: RoleCheckboxGroupProps) {
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
        // Grant-lock applies only when the role isn't already held: block adding it, allow removing it.
        const grantReason = lockGrantRoleCodes?.[role.code];
        const disabled = !!grantReason && !assignment;
        return (
          <RoleBox
            key={role.code}
            role={role}
            checked={!!assignment}
            orgCodes={assignment?.orgCodes ?? []}
            onToggle={checked => toggleRole(role, checked)}
            onOrgCodesChange={orgCodes => setOrgCodes(role.code, orgCodes)}
            onViewPermissions={() => setPermissionsRole(role)}
            disabled={disabled}
            disabledReason={disabled ? grantReason : undefined}
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
