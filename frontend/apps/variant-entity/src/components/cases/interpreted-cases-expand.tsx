import { VariantExpandedInterpretedCase, VariantInterpretedCase } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import { variantsApi } from '@/utils/api';
import { sanitizeHtml, decodeHtmlEntities } from '@/utils/helper';
import { Copy, Mars, Stethoscope, User, Venus } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

interface InterpretedCasesExpendProps {
  locusId: string;
  data: VariantInterpretedCase;
}

type VariantExpandedInterpretedCaseInput = {
  locusId: string;
  seqId: string;
  transcriptId: string;
};

async function fetchOccurrenceExpand(input: VariantExpandedInterpretedCaseInput) {
  const response = await variantsApi.getExpandedGermlineVariantInterpretedCase(
    input.locusId,
    input.seqId,
    input.transcriptId,
  );
  return response.data;
}

function InterpretedCasesExpand({ locusId, data }: InterpretedCasesExpendProps) {
  const { t } = useI18n();

  const { data: expandedData, isLoading } = useSWR<
    VariantExpandedInterpretedCase,
    any,
    VariantExpandedInterpretedCaseInput
  >(
    {
      locusId: locusId.toString(),
      seqId: data.seq_id.toString(),
      transcriptId: data.transcript_id,
    },
    fetchOccurrenceExpand,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const handleCopy = useCallback(() => {
    if (expandedData?.interpretation) {
      // Create a temporary div to strip HTML tags and get text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizeHtml(decodeHtmlEntities(expandedData.interpretation));
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      navigator.clipboard.writeText(textContent);
      toast.success(t('variantEntity.cases.interpreted-table.expend.copySuccess'));
    }
  }, [expandedData?.interpretation, t]);

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="flex justify-between gap-8">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Separator className="mt-6 mb-4" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 w-full">
        <div className="space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-muted-foreground">
            <div className="flex gap-1 items-center">
              <User size={16} />{' '}
              <span className="text-sm">
                {expandedData?.patient_id ? (
                  <Tooltip>
                    <TooltipTrigger>{expandedData?.patient_id}</TooltipTrigger>
                    <TooltipContent>{t('variantEntity.cases.interpreted-table.expand.patientId')}</TooltipContent>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <Stethoscope size={16} />
              <span className="text-sm">{expandedData?.interpreter_name || '-'}</span>
            </div>
          </div>
          <div
            className="text-sm whitespace-break-spaces"
            dangerouslySetInnerHTML={{
              __html: expandedData?.interpretation
                ? sanitizeHtml(decodeHtmlEntities(expandedData.interpretation))
                : '-',
            }}
          />
        </div>
        {expandedData?.interpretation && (
          <div className="flex-shrink-0">
            <Button variant="outline" size="xs" onClick={handleCopy}>
              <Copy /> {t('variantEntity.cases.interpreted-table.expend.copy')}
            </Button>
          </div>
        )}
      </div>
      <Separator className="mt-6 mb-4" />
      <div className="flex flex-wrap items-center gap-4 sm:gap-10">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">
            {expandedData?.gene_symbol ? (
              <a
                href={getOmimOrgUrl({
                  symbol: expandedData.gene_symbol,
                })}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {expandedData.gene_symbol}
              </a>
            ) : (
              '-'
            )}
          </div>
        </div>
        {expandedData?.classification_criterias && expandedData?.classification_criterias.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {expandedData?.classification_criterias.map(criteria => (
                <Badge variant="outline" key={criteria}>
                  {criteria}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          {expandedData?.inheritances?.map(inheritance => (
            <Tooltip key={inheritance}>
              <TooltipTrigger>
                <Badge variant="outline" key={inheritance}>
                  {t(`variant.transmission_mode.${inheritance}.abbrev`)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{t(`variant.transmission_mode.${inheritance}`)}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        {expandedData?.patient_sex_code && (
          <div className="flex items-center gap-2">
            <div className="p-1 border rounded">
              {expandedData?.patient_sex_code === 'male' ? <Mars size={14.4} /> : <Venus size={14.4} />}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs">
          <span>PMID:</span>
          {expandedData?.pubmed_ids && expandedData?.pubmed_ids.length > 0 ? (
            <div className="underline hover:cursor-pointer space-x-2">
              {expandedData?.pubmed_ids.map(pubmed => (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${pubmed}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {pubmed}
                </a>
              ))}
            </div>
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  );
}

export default InterpretedCasesExpand;
