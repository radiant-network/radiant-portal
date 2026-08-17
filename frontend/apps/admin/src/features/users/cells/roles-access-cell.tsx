import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import { ORGS_BY_CODE, ROLES_BY_CODE } from '../../../mock/data';
import type { AssignedRole } from '../../../mock/types';

/**
 * Roles & Access cell. The baseline `member` role is implicit for every user, so a user with no
 * explicit assignments renders muted "Member" text (not a chip). Otherwise, one chip per assigned
 * role, with an uppercased org-scope suffix (e.g. "CHOP • UCSF"); tenant-wide roles have no suffix.
 */
export default function RolesAccessCell({ roles }: { roles: AssignedRole[] }) {
  const { t } = useI18n();

  if (!roles.length) {
    return <span className="text-xs text-muted-foreground">{t('admin.users.member')}</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {roles.map((assigned, index) => {
        const role = ROLES_BY_CODE[assigned.roleCode];
        const label = role ? t(`admin.roles.${role.code}.name`) : assigned.roleCode;
        const isAdmin = assigned.roleCode === 'tenant_admin';
        const orgs = assigned.orgCodes ?? [];
        const allOrgs = orgs.includes('*'); // '*' sentinel = all current and future organizations
        return (
          <Badge key={index} variant={isAdmin ? 'blue' : 'secondary'} className="font-normal">
            <span>{label}</span>
            {orgs.length > 0 &&
              (allOrgs ? (
                <span className="text-muted-foreground">{t('admin.users.all_orgs')}</span>
              ) : (
                <span className="uppercase text-muted-foreground">
                  {orgs.map(code => ORGS_BY_CODE[code]?.code ?? code).join(' • ')}
                </span>
              ))}
          </Badge>
        );
      })}
    </div>
  );
}
