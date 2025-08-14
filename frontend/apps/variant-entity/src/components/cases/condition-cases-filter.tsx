import { useEffect, useState } from 'react';

import { Input } from '@/components/base/ui/input';
import { useI18n } from '@/components/hooks/i18n';
import { useDebounce } from '@/components/hooks/useDebounce';

interface ConditionCasesFilterProps {
  onChange: (value: string) => void;
}

const ConditionCasesFilter = ({ onChange }: ConditionCasesFilterProps) => {
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
      placeholder={t('variant_entity.cases.interpreted_table.filters.search_input_placeholder')}
    />
  );
};

export default ConditionCasesFilter;
