import { Search, X } from 'lucide-react';

import FilterButton from '@/components/base/buttons/filter-button';
import { Button } from '@/components/base/shadcn/button';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

type UsersFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  roles: string[];
  onRolesChange: (values: string[]) => void;
};

function UsersFilters({ search, onSearchChange, roles, onRolesChange }: UsersFiltersProps) {
  const { t } = useI18n();

  const hasActiveFilters = search.length > 0 || roles.length > 0;

  const clearAllFilters = () => {
    onSearchChange('');
    onRolesChange([]);
  };

  return (
    <div className="flex flex-2 flex-wrap items-center gap-2">
      <Input
        size="sm"
        startIcon={Search}
        placeholder={t('admin.users.filters.search_placeholder')}
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-72"
      />
      {/*
       * TODO(SJRA-1449): Options empty => waiting on back get roles
       */}
      <FilterButton
        dataCy="role"
        label={t('admin.users.filters.role')}
        options={[]}
        selected={roles}
        onSelect={onRolesChange}
      />
      {hasActiveFilters && (
        <Button variant="link" onClick={clearAllFilters} className="text-sm py-2 px-3 h-8">
          <X size={14} />
          {t('common.actions.clear')}
        </Button>
      )}
    </div>
  );
}
export default UsersFilters;
