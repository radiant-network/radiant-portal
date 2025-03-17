import { useCallback } from 'react';
import { GermlineInterpretationSchemaType } from './types';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/base/ui/form';
import { AutoComplete, Option } from '@/components/base/data-entry/auto-complete';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import { debounce } from '@/components/hooks/useDebounce';
import { Button } from '@/components/base/ui/button';

const MondoConditionFormField = () => {
  const form = useFormContext<GermlineInterpretationSchemaType>();

  const handleSearch = useCallback(async (searchValue: string): Promise<Option[]> => {
    if (searchValue) {
      return [
        {
          label: '',
          value: '',
        },
      ];
    }

    return [];
  }, []);

  const debouncedSearch = useCallback(
    debounce(value => handleSearch(value), 500),
    [],
  );

  return (
    <FormField
      control={form.control}
      name="condition"
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
                    className="flex gap-1 items-center"
                  >
                    MONDO ontology
                    <SquareArrowOutUpRightIcon />
                  </a>
                </Button>
              </div>
            }
          >
            Condition
          </FormLabel>
          <FormControl>
            <AutoComplete
              placeholder="e.g. muscular dystrophy"
              onSearch={async value => {
                if (value.length >= 3) {
                  return debouncedSearch(value);
                }

                return [];
              }}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MondoConditionFormField;
