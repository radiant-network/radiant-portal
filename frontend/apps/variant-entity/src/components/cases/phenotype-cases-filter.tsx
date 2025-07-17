import { Input } from '@/components/base/ui/input';
import { useI18n } from '@/components/hooks/i18n';
import { useDebounce } from '@/components/hooks/useDebounce';
import { useEffect, useState } from 'react';

interface PhenotypeCasesFilterProps {
  onChange: (value: string) => void;
}

const PhenotypeCasesFilter = ({ onChange }: PhenotypeCasesFilterProps) => {
  const { t } = useI18n();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  return (
    <Input
      wrapperClassName="w-full max-w-[385px]"
      onChange={value => setSearchValue(value.target.value)}
      placeholder={t('variantEntity.cases.other-table.filters.searchInputPlaceholder')}
    />
  );
};

export default PhenotypeCasesFilter;
