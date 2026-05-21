import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusIcon, XIcon } from 'lucide-react';
import useSWR from 'swr';

import InputSearch from '@/components/base/data-entry/input-search';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { FormLabel, FormMessage } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';
import { interpretationApi } from '@/utils/api';

import { GenericInterpretationSchemaType } from './types';

function PubmedFormField() {
  const { t } = useI18n();
  const { control, register, getValues, setError, clearErrors, setValue, getFieldState } =
    useFormContext<GenericInterpretationSchemaType>();
  const { fields, append, remove } = useFieldArray<GenericInterpretationSchemaType>({
    control,
    name: 'pubmed',
  });

  const [pubmedFetchKey, setPubmedFetchKey] = useState<{ value: string; index: number }>();

  const pubmedFetch = useSWR(
    pubmedFetchKey,
    ({ value }) => interpretationApi.getPubmedCitation(value).then(res => res.data),
    {
      onSuccess: data => {
        if (pubmedFetchKey?.index !== undefined) {
          setValue(`pubmed.${pubmedFetchKey.index}`, {
            citation_id: data.id!.replace('pmid:', ''),
            citation: data.nlm?.format!,
          });
        }
      },
      onError: () => {
        if (pubmedFetchKey?.index) {
          setError(`pubmed.${pubmedFetchKey.index}.citation`, {
            message: t('variant.interpretation_form.generic.pub_med_id_not_found'),
          });
        }
      },
      revalidateOnFocus: false,
    },
  );

  const pubmeds = getValues().pubmed;

  return (
    <div className="space-y-2.5">
      <FormLabel
        infoCardContent={
          <div className="leading-6">
            {t('variant.interpretation_form.generic.pub_med_publication_popover.enter')}{' '}
            <AnchorLink
              className="inline-flex"
              href="https://pubmed.ncbi.nlm.nih.gov/"
              target="_blank"
              size="sm"
              external
            >
              {t('variant.interpretation_form.generic.pub_med_publication_popover.pmid')}
            </AnchorLink>
          </div>
        }
      >
        {t('variant.interpretation_form.generic.pub_med_publication')}
      </FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => {
          const citation = getValues().pubmed?.[index].citation;
          const citationId = getValues().pubmed?.[index].citation_id;
          const error = getFieldState(`pubmed.${index}.citation`).error;

          return (
            <div key={`citation-id-${field.id}`}>
              <Input {...register(`pubmed.${index}.citation_id`)} className="hidden" />
              {citation && citationId ? (
                <div className="flex items-center gap-1">
                  <div className="flex-1 border border-input rounded-md p-2 text-sm">{citation}</div>
                  <div>
                    <Button
                      iconOnly
                      variant="link"
                      onClick={e => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      <XIcon />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <InputSearch
                    key={`citation-${field.id}`}
                    searchButtonProps={{
                      loading: pubmedFetch.isValidating,
                      disabled: !!error,
                    }}
                    autoFocus
                    placeholder={t('variant.interpretation_form.generic.citation_placeholder')}
                    onSearch={searchValue =>
                      setPubmedFetchKey({
                        value: searchValue,
                        index,
                      })
                    }
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
          <PlusIcon /> {t('variant.interpretation_form.generic.add_citation')}
        </Button>
      </div>
    </div>
  );
}

export default PubmedFormField;
