import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { Field } from '@/components/base/shadcn/field';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
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
    <Field className="w-full min-w-[250px] max-w-[385px]">
      <Label>{t('variant_entity.cases.other_table.filters.search_hpo')}</Label>
      <Input
        onChange={value => setSearchValue(value.target.value)}
        placeholder={t('variant_entity.cases.other_table.filters.search_hpo_placeholder')}
        size="sm"
        startIcon={Search}
      />
    </Field>
  );
};

export default PhenotypeCasesFilter;
