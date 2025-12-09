import { useEffect, useState } from 'react';

import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';
import { useDebounce } from '@/components/hooks/useDebounce';

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
      placeholder={t('variant_entity.cases.other_table.filters.search_input_placeholder')}
    />
  );
};

export default PhenotypeCasesFilter;
