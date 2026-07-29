import { ASSIGNABLE_ROLES } from '../../mock/data';
import type { Role } from '../../mock/types';

import RoleBox from './role-box';
import type { RoleAssignmentForm } from './user-form.types';

type RoleCheckboxGroupProps = {
  /** Current assignments (excludes the implicit baseline `member` and the promoted `tenant_admin`). */
  value: RoleAssignmentForm[];
  onChange: (next: RoleAssignmentForm[]) => void;
  /**
   * Open the shared "view permissions" dialog for a role. Owned by the sheet (not this group) so the
   * baseline line can reuse the same dialog for the implicit `member` role.
   */
  onViewPermissions: (role: Role) => void;
};

/**
 * The "Member roles" box group: one selectable box per additive role (everything except the implicit
 * `member` and the promoted Administrator). Checking an org-scoped role reveals its inline org picker.
 */
export default function RoleCheckboxGroup({ value, onChange, onViewPermissions }: RoleCheckboxGroupProps) {
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
            onViewPermissions={() => onViewPermissions(role)}
          />
        );
      })}
    </div>
  );
}
