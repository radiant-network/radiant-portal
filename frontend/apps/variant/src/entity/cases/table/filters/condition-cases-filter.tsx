import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { Field, FieldLabel } from '@/components/base/shadcn/field';
import { Input } from '@/components/base/shadcn/input';
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
    <Field className="w-full min-w-[250px] max-w-[385px] gap-2">
      <FieldLabel>{t('variant_entity.cases.interpreted_table.filters.search_condition')}</FieldLabel>
      <Input
        onChange={value => setSearchValue(value.target.value)}
        placeholder={t('variant_entity.cases.interpreted_table.filters.search_condition_placeholder')}
        size="sm"
        startIcon={Search}
      />
    </Field>
  );
};

export default ConditionCasesFilter;
