import { type FormEvent, useId, useRef, useState } from 'react';
import { ArrowRightIcon, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';

import { SqonOpEnum } from '@/api/index';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/base/shadcn/input-group';
import { Label } from '@/components/base/shadcn/label';
import { Spinner } from '@/components/base/shadcn/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import type { Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';
import { useTaskIdFromSearchParam } from '@/utils/helper';

import { QBActionType, useQBContext, useQBDispatch, useQBSearchValue } from '../hooks/use-query-builder';

import { formatFoundMessage, toSearchOutcome } from './search-by-variant-facet.mapping';

const HGVSG_FIELD = 'hgvsg';

type SearchByVariantFacetProps = {
  search: AggregationConfig;
};

function SearchByVariantFacet({ search }: SearchByVariantFacetProps) {
  const { t } = useI18n();
  const dispatch = useQBDispatch();
  const { fetcher } = useQBContext();
  const taskId = useTaskIdFromSearchParam();
  const currentValues = useQBSearchValue(HGVSG_FIELD);
  const inputId = useId();
  const descriptionId = useId();
  const messageId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const { translation_key } = search;
  const { searchVariant } = fetcher;
  const canSearch = searchVariant !== undefined && taskId !== undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || pending || !canSearch) return;

    setPending(true);
    setMessage('');
    try {
      const data = await searchVariant(trimmed);
      const existing = Array.isArray(currentValues) ? (currentValues as string[]) : [];
      const outcome = toSearchOutcome(existing, data);

      if (outcome.type === 'found') {
        dispatch({
          type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
          payload: {
            content: { field: HGVSG_FIELD, value: outcome.values },
            op: SqonOpEnum.In,
          },
        });
        setMessage(formatFoundMessage(outcome.normalizedInput, outcome.hits, t));
      } else {
        const dialogKey = outcome.type === 'invalid' ? 'invalid' : 'not_found';
        alertDialog.open({
          type: 'warning',
          title: t(`common.facets.labels.${translation_key}_${dialogKey}_title`),
          description: t(`common.facets.labels.${translation_key}_${dialogKey}_description`),
          hideCancel: true,
          actionProps: { children: t('common.close'), dataCy: 'search-by-variant-dialog-close' },
        });
      }
    } catch {
      toast.error(t(`common.facets.labels.${translation_key}_toast_error`));
    } finally {
      setPending(false);
      setInput('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2" data-cy={`search-facet-${HGVSG_FIELD}`}>
      <div className="flex items-center gap-2">
        <Label htmlFor={inputId}>{t(`common.facets.labels.${translation_key}`)}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon size={16} data-cy={`search-facet-tooltip-${HGVSG_FIELD}`} />
          </TooltipTrigger>
          <TooltipContent data-cy={`search-facet-tooltip-content-${HGVSG_FIELD}`}>
            {t(`common.facets.labels.${translation_key}_tooltip`)}
          </TooltipContent>
        </Tooltip>
        <span id={descriptionId} hidden>
          {t(`common.facets.labels.${translation_key}_tooltip`)}
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <InputGroup className={cn('h-8', pending && 'opacity-50')} data-disabled={pending}>
          <InputGroupInput
            id={inputId}
            ref={inputRef}
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder={t(`common.facets.labels.${translation_key}_placeholder`)}
            aria-describedby={`${descriptionId} ${messageId}`}
            readOnly={pending}
            className="h-full px-2.5"
          />
          <InputGroupAddon align="inline-end" className="h-full py-0 pr-0 has-[>button]:mr-0">
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              className="h-full rounded-l-none"
              disabled={pending || !canSearch || !input.trim()}
              aria-label={t('a11y.search_by_variant_facet.submit')}
            >
              {pending ? <Spinner /> : <ArrowRightIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
      <p id={messageId} role="status" aria-live="polite" className="sr-only" data-cy="search-by-variant-message">
        {message}
      </p>
    </div>
  );
}

export default SearchByVariantFacet;
