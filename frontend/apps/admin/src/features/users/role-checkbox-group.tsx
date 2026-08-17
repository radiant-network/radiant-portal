import CheckboxGroupField, { type CheckboxGroupFieldItem } from '@/components/base/checkboxes/checkbox-group-field';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

import { ASSIGNABLE_ROLES, getRoleScopes, roleIsOrgScoped, SCOPE_BADGE_VARIANT } from '../../mock/data';
import type { Role } from '../../mock/types';

import OrgAssignmentField from './org-assignment-field';
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
  /** Codes of org-scoped roles that are checked but missing an org, after a submit attempt. */
  orgErrorRoleCodes?: string[];
};

/**
 * The "Member roles" box group: one selectable box per additive role (everything except the implicit
 * `member` and the promoted Administrator). Built on the shared design-system `CheckboxGroupField`
 * (`box` variant) — the role name is the label, the description + "View permissions" link is the
 * description, the scope badge(s) sit top-right (`extraTitle`), and checking an org-scoped role reveals
 * its inline org picker (`extraContent`, rendered only while the box is checked).
 */
export default function RoleCheckboxGroup({
  value,
  onChange,
  onViewPermissions,
  orgErrorRoleCodes = [],
}: RoleCheckboxGroupProps) {
  const { t } = useI18n();

  const setOrgCodes = (roleCode: string, orgCodes: string[]) => {
    onChange(value.map(assignment => (assignment.roleCode === roleCode ? { ...assignment, orgCodes } : assignment)));
  };

  const data: CheckboxGroupFieldItem[] = ASSIGNABLE_ROLES.map(role => ({
    id: role.code,
    label: t(`admin.roles.${role.code}.name`),
    // Description text + the "View permissions" link. As an interactive descendant of the box's
    // <label>, clicking the link does not toggle the checkbox (per the HTML label spec) — inspecting a
    // role is read-only and harmless.
    description: (
      <>
        {t(`admin.roles.${role.code}.description`)}{' '}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 align-baseline text-sm"
          onClick={() => onViewPermissions(role)}
        >
          {t('admin.user.view_permissions')}
        </Button>
      </>
    ),
    // Scope badge(s), pinned top-right so a long description wraps in its own column.
    extraTitle: (
      <div className="flex shrink-0 items-center gap-1">
        {getRoleScopes(role).map(scope => (
          <Badge key={scope} variant={SCOPE_BADGE_VARIANT[scope]} className="font-normal">
            {t(`admin.roles.scope.${scope}`)}
          </Badge>
        ))}
      </div>
    ),
    // Org picker for org-scoped roles only; CheckboxGroupField renders it just while the box is checked.
    extraContent: roleIsOrgScoped(role) ? (
      <OrgAssignmentField
        value={value.find(assignment => assignment.roleCode === role.code)?.orgCodes ?? []}
        onChange={orgCodes => setOrgCodes(role.code, orgCodes)}
        error={orgErrorRoleCodes.includes(role.code)}
      />
    ) : undefined,
  }));

  return (
    <CheckboxGroupField
      box
      data={data}
      value={value.map(assignment => assignment.roleCode)}
      onValueChange={nextCodes =>
        // Rebuild the assignment list from the checked codes, preserving each role's already-picked orgs.
        onChange(
          nextCodes.map(
            code => value.find(assignment => assignment.roleCode === code) ?? { roleCode: code, orgCodes: [] },
          ),
        )
      }
      className="gap-3"
    />
  );
}
