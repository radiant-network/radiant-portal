import { Search, X } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import { useI18n } from '@/components/hooks/i18n';

type RolesFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  customOnly: boolean;
  onCustomOnlyChange: (value: boolean) => void;
};

function RolesFilters({ search, onSearchChange, customOnly, onCustomOnlyChange }: RolesFiltersProps) {
  const { t } = useI18n();

  const hasActiveFilters = search.length > 0 || customOnly;

  const clearAllFilters = () => {
    onSearchChange('');
    onCustomOnlyChange(false);
  };

  return (
    <div className="flex flex-2 flex-wrap items-center gap-3">
      <Input
        size="sm"
        startIcon={Search}
        placeholder={t('admin.roles.filters.search_placeholder')}
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-72"
      />
      <Label className="flex cursor-pointer items-center gap-2">
        <Checkbox checked={customOnly} onCheckedChange={checked => onCustomOnlyChange(checked === true)} />
        {t('admin.roles.filters.custom_only')}
      </Label>
      {hasActiveFilters && (
        <Button variant="link" onClick={clearAllFilters} className="text-sm py-2 px-3 h-8">
          <X size={14} />
          {t('common.actions.clear')}
        </Button>
      )}
    </div>
  );
}
export default RolesFilters;
