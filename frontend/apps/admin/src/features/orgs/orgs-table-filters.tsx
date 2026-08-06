import { Search, X } from 'lucide-react';

import FilterButton from '@/components/base/buttons/filter-button';
import { Button } from '@/components/base/shadcn/button';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

import { ORG_CATEGORIES } from '../../mock/data';

export type OrgsFilterState = {
  search: string;
  categories: string[];
};

type OrgsTableFiltersProps = {
  value: OrgsFilterState;
  onChange: (next: OrgsFilterState) => void;
};

/**
 * Toolbar for the Organizations table: search (name or code) + a "Category" dashed filter pill.
 * Filtering is applied client-side against the mock data in the page. The gear + fullscreen
 * controls are rendered by DataTable itself, to the right of this slot. Mirrors the Members toolbar.
 */
export default function OrgsTableFilters({ value, onChange }: OrgsTableFiltersProps) {
  const { t } = useI18n();

  const categoryOptions = ORG_CATEGORIES.map(c => ({ key: c.code, label: t(`admin.org_categories.${c.code}`) }));

  const hasActiveFilters = value.search.length > 0 || value.categories.length > 0;

  const clearAll = () => onChange({ search: '', categories: [] });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        startIcon={Search}
        placeholder={t('admin.orgs.search_placeholder')}
        value={value.search}
        onChange={e => onChange({ ...value, search: e.target.value })}
        className="w-72"
      />
      <FilterButton
        label={t('admin.orgs.filter.category')}
        options={categoryOptions}
        selected={value.categories}
        onSelect={categories => onChange({ ...value, categories })}
        popoverSize="md"
        dataCy="orgs-category"
      />
      {hasActiveFilters && (
        <Button data-cy="orgs-filters-clear" variant="link" onClick={clearAll} className="h-8 px-3 py-2 text-sm">
          <X size={14} />
          {t('common.actions.clear')}
        </Button>
      )}
    </div>
  );
}
