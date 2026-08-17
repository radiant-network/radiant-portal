import { Search, X } from 'lucide-react';

import FilterButton from '@/components/base/buttons/filter-button';
import { Button } from '@/components/base/shadcn/button';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

import { MOCK_ROLES } from '../../mock/data';

export type UsersFilterState = {
  search: string;
  roles: string[];
};

type UsersTableFiltersProps = {
  value: UsersFilterState;
  onChange: (next: UsersFilterState) => void;
};

/**
 * Toolbar for the Users table: search + "Role" / "Organization" dashed filter pills.
 * Filtering is applied client-side against the mock data in the page. The gear + fullscreen
 * controls are rendered by DataTable itself, to the right of this slot.
 */
export default function UsersTableFilters({ value, onChange }: UsersTableFiltersProps) {
  const { t } = useI18n();

  // Grantable roles, plus a "Member" option meaning "baseline only" (no additional role assigned).
  // It matches exactly the rows the Roles & Access column labels "Member", so filter and column agree.
  const roleOptions = [
    ...MOCK_ROLES.filter(r => r.code !== 'member').map(r => ({ key: r.code, label: t(`admin.roles.${r.code}.name`) })),
    { key: 'member', label: t('admin.users.member') },
  ];

  const hasActiveFilters = value.search.length > 0 || value.roles.length > 0;

  const clearAll = () => onChange({ search: '', roles: [] });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        startIcon={Search}
        placeholder={t('admin.users.search_placeholder')}
        value={value.search}
        onChange={e => onChange({ ...value, search: e.target.value })}
        className="w-72"
      />
      <FilterButton
        label={t('admin.users.filter.role')}
        options={roleOptions}
        selected={value.roles}
        onSelect={roles => onChange({ ...value, roles })}
        dataCy="users-role"
      />
      {hasActiveFilters && (
        <Button data-cy="users-filters-clear" variant="link" onClick={clearAll} className="h-8 px-3 py-2 text-sm">
          <X size={14} />
          {t('common.actions.clear')}
        </Button>
      )}
    </div>
  );
}
