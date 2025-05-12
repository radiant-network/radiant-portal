import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { mondoApi } from '@/utils/api';
import capitalize from 'lodash/capitalize';
import { ListFilter } from 'lucide-react';
import { useI18n } from '@/components/hooks/i18n';
import { debounce } from '@/components/hooks/useDebounce';
import MondoOptionItemLabel from '@/components/feature/variant/mondo-option-item-label';
import { AutoComplete, AutoCompleteProps, Option } from '@/components/base/data-entry/auto-complete';

interface CasesMondoAutocompleteProps {
  onChange?: AutoCompleteProps<any>['onChange'];
}

function CasesMondoAutocomplete({ onChange }: CasesMondoAutocompleteProps) {
  const { t } = useI18n();
  const [options, setOptions] = useState<Option[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const mondoSearch = useSWR(searchValue, (value: string) => mondoApi.mondoTermAutoComplete(value), {
    onSuccess: data => {
      setOptions(
        data.data.map(item => ({
          label: <MondoOptionItemLabel mondo={item} />,
          value: item.source?.id || '',
          display: capitalize(item.source?.name),
          filter: `${item.source?.name}${item.source?.id}`,
        })),
      );
    },
    revalidateOnFocus: false,
  });

  const debouncedSearch = useCallback(
    debounce(value => setSearchValue(value), 500),
    [],
  );

  return (
    <AutoComplete
      placeholder={t('variantEntity.cases.filters.searchInputPlaceholder')}
      onSearch={value => {
        if (value.length >= 3) {
          debouncedSearch(value);
        }
      }}
      options={options}
      loading={mondoSearch.isValidating}
      optionFilterProp="filter"
      optionLabelProp="display"
      className="w-full max-w-[385px]"
      leftAddon={<ListFilter size={16} className="text-muted-foreground mr-1" />}
      onChange={onChange}
    />
  );
}

export default CasesMondoAutocomplete;
