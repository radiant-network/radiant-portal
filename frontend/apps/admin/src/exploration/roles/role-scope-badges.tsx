import { RoleActionResultScopeEnum, RoleResultScopeEnum } from '@/api/api';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

export function ScopeBadge({ scope }: { scope: RoleActionResultScopeEnum }) {
  const { t } = useI18n();
  const isTenant = scope === RoleActionResultScopeEnum.Tenant;

  return (
    <Badge variant={isTenant ? 'cyan' : 'violet'} className="font-normal">
      {isTenant ? t('admin.users.roles.scope.network') : t('admin.users.roles.scope.organization')}
    </Badge>
  );
}

export function ScopeBadges({ scope }: { scope: RoleResultScopeEnum }) {
  const isNetwork = scope === RoleResultScopeEnum.Tenant || scope === RoleResultScopeEnum.Mixed;
  const isOrganization = scope === RoleResultScopeEnum.Org || scope === RoleResultScopeEnum.Mixed;

  return (
    <div className="flex shrink-0 items-center gap-1">
      {isNetwork && <ScopeBadge scope={RoleActionResultScopeEnum.Tenant} />}
      {isOrganization && <ScopeBadge scope={RoleActionResultScopeEnum.Org} />}
    </div>
  );
}
