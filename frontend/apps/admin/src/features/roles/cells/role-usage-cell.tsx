import { useI18n } from '@/components/hooks/i18n';

import { getRoleUsage } from '../../../mock/data';
import type { AdminUser, Role } from '../../../mock/types';

type RoleUsageCellProps = {
  role: Role;
  users: AdminUser[];
  onViewMembers: (role: Role) => void;
};

/**
 * "Assigned to" cell: the member count (a button deep-linking to the Members table filtered to this
 * role) stacked over the organization count for org-scoped roles. 0 members renders muted and
 * non-clickable, with no org line.
 */
export default function RoleUsageCell({ role, users, onViewMembers }: RoleUsageCellProps) {
  const { t } = useI18n();
  const { members, orgs } = getRoleUsage(role, users);

  return (
    <div className="flex flex-col gap-0.5 text-sm">
      {members > 0 ? (
        <button
          type="button"
          onClick={() => onViewMembers(role)}
          className="w-fit cursor-pointer text-primary hover:underline"
        >
          {t('admin.roles_page.members_count', { count: members })}
        </button>
      ) : (
        <span className="text-muted-foreground">{t('admin.roles_page.members_count', { count: members })}</span>
      )}
      {orgs > 0 && <span className="text-muted-foreground">{t('admin.roles_page.orgs_count', { count: orgs })}</span>}
    </div>
  );
}
