import { useFieldArray, useFormContext } from 'react-hook-form';
import { GenericInterpretationSchemaType } from './types';
import { useState } from 'react';
import { interpretationApi } from '@/utils/api';
import { FormLabel, FormMessage } from '@/components/base/ui/form';
import { Input } from '@/components/base/ui/input';
import { IconButton } from '@/components/base/Buttons';
import { PlusIcon, XIcon } from 'lucide-react';
import InputSearch from '@/components/base/data-entry/input-search';
import { Button } from '@/components/base/ui/button';

function PubmedFormField() {
  const { control, register, getValues, setError, clearErrors, setValue, getFieldState } =
    useFormContext<GenericInterpretationSchemaType>();
  const { fields, append, remove } = useFieldArray<GenericInterpretationSchemaType>({
    control,
    name: 'pubmed',
  });

  const [loading, setLoading] = useState(false);

  const fetchCitation = async (value: string, index: number) => {
    if (!value) return;

    setLoading(true);
    try {
      const { data } = await interpretationApi.getPubmedCitation(value);

      setValue(`pubmed.${index}`, {
        citation_id: data.id!,
        citation: data.nlm?.format!,
      });
    } catch {
      setError(`pubmed.${index}.citation`, {
        message: 'Invalid or unknown PMID',
      });
    } finally {
      setLoading(false);
    }
  };

  const pubmeds = getValues().pubmed;

  return (
    <div className="space-y-2.5">
      <FormLabel>PubMed Publication</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => {
          const citation = getValues().pubmed?.[index].citation;
          const citationId = getValues().pubmed?.[index].citation_id;
          const error = getFieldState(`pubmed.${index}.citation`).error;

          return (
            <div>
              <Input key={`citation-id-${field.id}`} {...register(`pubmed.${index}.citation_id`)} className="hidden" />
              {citation && citationId ? (
                <div className="flex items-center gap-1">
                  <div className="border rounded-md p-2 text-sm">{citation}</div>
                  <div>
                    <IconButton
                      icon={XIcon}
                      size="md"
                      variant="link"
                      onClick={e => {
                        e.preventDefault();
                        remove(index);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <InputSearch
                    key={`citation-${field.id}`}
                    searchButtonProps={{
                      color: 'primary',
                      variant: 'filled',
                      loading,
                      disabled: !!error,
                    }}
                    autoFocus
                    onSearch={searchValue => fetchCitation(searchValue, index)}
                    {...register(`pubmed.${index}.citation`, {
                      onChange: () => {
                        if (error) {
                          clearErrors(`pubmed.${index}.citation`);
                        }
                      },
                    })}
                  />
                  {error?.message && <FormMessage>{error?.message}</FormMessage>}
                </div>
              )}
            </div>
          );
        })}
        <Button
          variant="link"
          size="sm"
          className="px-0 gap-1"
          disabled={!!pubmeds?.length && !pubmeds?.[pubmeds.length - 1]?.citation_id}
          onClick={() =>
            append({
              citation_id: '',
              citation: '',
            })
          }
        >
          <PlusIcon /> Add a publication
        </Button>
      </div>
    </div>
  );
}

export default PubmedFormField;
