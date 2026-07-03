import { X } from 'lucide-react';

import FilterButton from '@/components/base/buttons/filter-button';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

import { AREA_OF_INTEREST, ROLE_OPTIONS } from './mocks/community-model';

type CommunityFiltersProps = {
  roles: string[];
  onRolesChange: (roles: string[]) => void;
  areasOfInterest: string[];
  onAreasOfInterestChange: (areasOfInterest: string[]) => void;
  onClear: () => void;
};

export default function CommunityFilters({
  roles,
  onRolesChange,
  areasOfInterest,
  onAreasOfInterestChange,
  onClear,
}: CommunityFiltersProps) {
  const { t } = useI18n();
  const hasActiveFilters = roles.length > 0 || areasOfInterest.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterButton
        label={t('community.filters.role')}
        options={ROLE_OPTIONS}
        selected={roles}
        onSelect={onRolesChange}
        popoverSize="sm"
      />
      <FilterButton
        label={t('community.filters.area_of_interest')}
        options={AREA_OF_INTEREST}
        selected={areasOfInterest}
        onSelect={onAreasOfInterestChange}
        popoverSize="md"
        withTooltip
      />
      {hasActiveFilters && (
        <Button variant="link" onClick={onClear} className="text-sm py-2 px-3 h-8">
          <X size={14} />
          {t('common.actions.clear')}
        </Button>
      )}
    </div>
  );
}
