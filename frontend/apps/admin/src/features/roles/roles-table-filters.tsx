import { Search, X } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

export type RolesFilterState = {
  search: string;
  /** When true, hide default roles and show only custom ones. */
  customOnly: boolean;
};

type RolesTableFiltersProps = {
  value: RolesFilterState;
  onChange: (next: RolesFilterState) => void;
};

/**
 * Toolbar for the Roles table: search (role name) + a "Custom roles only" checkbox. Filtering is
 * applied client-side against the mock data in the page. Mirrors the Members/Orgs toolbars.
 */
export default function RolesTableFilters({ value, onChange }: RolesTableFiltersProps) {
  const { t } = useI18n();

  const hasActiveFilters = value.search.length > 0 || value.customOnly;

  const clearAll = () => onChange({ search: '', customOnly: false });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        startIcon={Search}
        placeholder={t('admin.roles_page.search_placeholder')}
        value={value.search}
        onChange={e => onChange({ ...value, search: e.target.value })}
        className="w-72"
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <Checkbox
          checked={value.customOnly}
          onCheckedChange={checked => onChange({ ...value, customOnly: checked === true })}
          data-cy="roles-custom-only"
        />
        {t('admin.roles_page.custom_only')}
      </label>
      {hasActiveFilters && (
        <Button data-cy="roles-filters-clear" variant="link" onClick={clearAll} className="h-8 px-3 py-2 text-sm">
          <X size={14} />
          {t('common.actions.clear')}
        </Button>
      )}
    </div>
  );
}
