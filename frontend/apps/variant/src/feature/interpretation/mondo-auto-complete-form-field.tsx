import { useCallback, useState } from 'react';
import { GermlineInterpretationSchemaType, SomaticInterpretationSchemaType } from './types';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/base/ui/form';
import { AutoComplete, Option } from '@/components/base/data-entry/auto-complete';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import { debounce } from '@/components/hooks/useDebounce';
import { Button } from '@/components/base/ui/button';
import { mondoApi } from '@/utils/api';
import capitalize from 'lodash/capitalize';
import InterpretationMondoOptionItemLabel from './mondo-option-item-label';
import useSWR from 'swr';

type MondoAutoCompleteFormFieldProps = {
  name: keyof GermlineInterpretationSchemaType | keyof SomaticInterpretationSchemaType;
  label: string;
  placeholder: string;
};

function MondoAutoCompleteFormField({ name, label, placeholder }: MondoAutoCompleteFormFieldProps) {
  const form = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const mondoSearch = useSWR(
    searchValue || form.getValues(name),
    (value: string) => mondoApi.mondoTermAutoComplete(value),
    {
      onSuccess: data => {
        setOptions(
          data.data.map(item => ({
            label: <InterpretationMondoOptionItemLabel mondo={item} />,
            value: item.source?.id || '',
            display: capitalize(item.source?.name),
            filter: `${item.source?.name}${item.source?.id}`,
          })),
        );
      },
      revalidateOnFocus: false,
    },
  );

  const debouncedSearch = useCallback(
    debounce(value => setSearchValue(value), 500),
    [],
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            infoCardContent={
              <div className="leading-6">
                Search for a medical condition in{' '}
                <Button variant="link" size="sm">
                  <a
                    target="_blank"
                    href="https://www.ebi.ac.uk/ols4/ontologies/mondo"
                    className="flex gap-1 items-center outline-none"
                  >
                    MONDO ontology
                    <SquareArrowOutUpRightIcon />
                  </a>
                </Button>
              </div>
            }
          >
            {label}
          </FormLabel>
          <FormControl>
            <AutoComplete
              placeholder={placeholder}
              onSearch={value => {
                if (value.length >= 3) {
                  debouncedSearch(value);
                }
              }}
              options={options}
              loading={mondoSearch.isValidating}
              optionFilterProp="filter"
              optionLabelProp="display"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default MondoAutoCompleteFormField;
