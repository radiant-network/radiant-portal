import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import capitalize from 'lodash/capitalize';
import useSWR from 'swr';

import { AutoComplete, Option } from '@/components/base/data-entry/auto-complete';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { useI18n } from '@/components/hooks/i18n';
import { debounce } from '@/components/hooks/useDebounce';
import { mondoApi } from '@/utils/api';
import MondoOptionItemLabel from 'components/base/variant/mondo-option-item-label';

import {
  germlineInterpretationFormSchema,
  GermlineInterpretationSchemaType,
  SomaticInterpretationSchemaType,
} from './types';

type MondoAutoCompleteFormFieldProps = {
  name: keyof GermlineInterpretationSchemaType | keyof SomaticInterpretationSchemaType;
  label: string;
  placeholder: string;
};

function MondoAutoCompleteFormField({ name, label, placeholder }: MondoAutoCompleteFormFieldProps) {
  const { t } = useI18n();
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
            label: <MondoOptionItemLabel mondo={item} />,
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
      schema={germlineInterpretationFormSchema}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            infoCardContent={
              <div className="leading-6">
                {t('variant.interpretation_form.germline.condition_popover')}{' '}
                <AnchorLink href="https://www.ebi.ac.uk/ols4/ontologies/mondo" target="_blank" size="sm" external>
                  {t('variant.interpretation_form.germline.condition_popover_link')}
                </AnchorLink>
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
