import { useI18n } from '@/components/hooks/i18n';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import { Button } from '@/components/base/ui/button';
import { TFunction } from 'i18next';
import CasesMondoAutocomplete from './cases-mondo-autocomplete';

export enum CasesCreatedAtSort {
  mostRecent = 'mostRecent',
  leastRecent = 'leastRecent',
}

export interface CasesFiltersState {
  createdAtSort: CasesCreatedAtSort;
  institution: string;
  test: string;
  classification: string;
}

interface CasesFilterBarProps {
  filters: CasesFiltersState;
  onFiltersChange: (filters: CasesFiltersState) => void;
}

const getCreatedAtItems = (t: TFunction<string, undefined>) => {
  return [
    {
      label: t('variantEntity.cases.filters.createdAt.mostRecent'),
      value: CasesCreatedAtSort.mostRecent,
    },
    { label: t('variantEntity.cases.filters.createdAt.leastRecent'), value: CasesCreatedAtSort.leastRecent },
  ];
};

function CasesFilters({ filters, onFiltersChange }: CasesFilterBarProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <label className="text-sm">{t('variantEntity.cases.filters.label')}</label>
      <div className="flex items-center gap-2">
        <CasesMondoAutocomplete onChange={console.log} />
        <Select defaultValue="all">
          <SelectTrigger className="w-full max-w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('variantEntity.cases.filters.classifications.allClassifications')}</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full max-w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('variantEntity.cases.filters.institutions.allInstitutions')}</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full max-w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('variantEntity.cases.filters.tests.allTests')}</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <ArrowUpDown size={16} />
              {t(`variantEntity.cases.filters.createdAt.${filters.createdAtSort}`)}
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {getCreatedAtItems(t).map(item => (
              <DropdownMenuItem
                key={item.value}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    createdAtSort: item.value,
                  })
                }
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default CasesFilters;
