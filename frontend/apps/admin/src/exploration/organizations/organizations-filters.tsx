import { Search, X } from 'lucide-react';

import FilterButton, { type IFilterButtonItem } from '@/components/base/buttons/filter-button';
import { sortOptions } from '@/components/base/data-table/filters/data-table-filters';
import { Button } from '@/components/base/shadcn/button';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

import { useOrganizationCategories } from './use-organization-categories';

type OrganizationsFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  onCategoriesChange: (values: string[]) => void;
};

function OrganizationsFilters({ search, onSearchChange, categories, onCategoriesChange }: OrganizationsFiltersProps) {
  const { t } = useI18n();

  const { data } = useOrganizationCategories();

  const options: IFilterButtonItem[] = sortOptions((data ?? []).map(({ code, name }) => ({ key: code, label: name })));

  const hasActiveFilters = search.length > 0 || categories.length > 0;

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoriesChange([]);
  };

  return (
    <div className="flex flex-2 flex-wrap items-center gap-2">
      <Input
        size="sm"
        startIcon={Search}
        placeholder={t('admin.organizations.filters.search_placeholder')}
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-72"
      />
      <FilterButton
        dataCy="category"
        label={t('admin.organizations.filters.category')}
        options={options}
        selected={categories}
        onSelect={onCategoriesChange}
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
export default OrganizationsFilters;
