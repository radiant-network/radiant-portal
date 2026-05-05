import { useEffect, useState } from 'react';
import { CalendarIcon, ClipboardList, LibraryBig, StethoscopeIcon } from 'lucide-react';
import useSWR from 'swr';

import { InterpretationGermline } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import TransmissionModeBadge from '@/components/base/badges/transmission-mode-badge';
import { getClassificationCriteriaColor } from '@/components/base/classifications/interpretation';
import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import DateTime from '@/components/base/date/datetime';
import EmptyField from '@/components/base/information/empty-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import PubmedListDialog from '@/components/base/pubmed/pubmed-list-dialog';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { DescriptionSection } from '@/components/base/slider/description';
import SliderCard from '@/components/base/slider/slider-card';
import TranscriptIdLink from '@/components/base/variant/transcript-id-link';
import { getOmimOrgUrl } from '@/components/base/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import { interpretationApi } from '@/utils/api';

type GermlineSliderInterpretationDetailsCardProps = {
  seqId: number;
  caseId: number;
  locusId: string;
  symbol?: string;
  transcriptId?: string;
  isCanonical?: boolean;
  isManeSelect?: boolean;
  isManePlus?: boolean;
  actions: React.ReactNode;
};

type InterpretationInput = {
  caseId: string;
  seqId: string;
  locusId: string;
  transcriptId: string;
};

export async function fetchInterpretation(input: InterpretationInput) {
  const response = await interpretationApi.getInterpretationGermline(
    input.caseId,
    input.seqId,
    input.locusId,
    input.transcriptId,
  );
  return response.data;
}

function GermlineSliderInterpretationDetailsCard({
  actions,
  seqId,
  caseId,
  locusId,
  isManeSelect,
  symbol,
  isManePlus,
  isCanonical,
  transcriptId,
}: GermlineSliderInterpretationDetailsCardProps) {
  const { t } = useI18n();
  const [isPubmedOpen, setIsPubmedOpen] = useState<boolean>(false);

  const interpretation = useSWR<InterpretationGermline>(
    {
      caseId,
      seqId: seqId,
      locusId: locusId,
      transcriptId: transcriptId,
    },
    fetchInterpretation,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    interpretation.mutate();
  }, []);

  if (interpretation.isLoading) {
    return (
      <SliderCard icon={ClipboardList} title={t('preview_sheet.interpretation_details.title')}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
          </div>
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-18 w-full rounded-md" />
        </div>
      </SliderCard>
    );
  }

  return (
    <SliderCard icon={ClipboardList} title={t('preview_sheet.interpretation_details.title')} actions={actions}>
      <div className="rounded-md w-full border">
        <div className="size-full">
          <div className="flex flex-col flex-wrap gap-4 items-start p-3 w-full">
            <div className="flex grow w-full">
              <div className="flex gap-6 w-full">
                <DescriptionSection title={t('preview_sheet.interpretation_details.fields.gene')} fullWidth={false}>
                  {symbol ? (
                    <AnchorLink
                      href={getOmimOrgUrl({ symbol })}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      size="sm"
                    >
                      {symbol}
                    </AnchorLink>
                  ) : (
                    <EmptyField />
                  )}
                </DescriptionSection>
                <DescriptionSection
                  title={t('preview_sheet.interpretation_details.fields.transcript')}
                  fullWidth={false}
                >
                  {transcriptId && (
                    <TranscriptIdLink
                      transcriptId={transcriptId}
                      isCanonical={isCanonical}
                      isManeSelect={isManeSelect}
                      isManePlus={isManePlus}
                      linkClassName="text-sm text-primary m-[-1px]"
                    />
                  )}
                </DescriptionSection>
              </div>
              <div className="flex justify-end w-full">
                <div>
                  <ClassificationBadge value={interpretation.data?.classification ?? ''} size="lg" />
                </div>
              </div>
            </div>
            <DescriptionSection title={t('preview_sheet.interpretation_details.fields.primary_condition')}>
              <div className="flex gap-2">
                <PhenotypeConditionLink
                  className="capitalize"
                  name={interpretation.data?.condition_name}
                  code={interpretation.data?.condition}
                  showCode={false}
                />
                <div className="flex gap-1">
                  {(interpretation.data?.transmission_modes ?? []).map(omim => (
                    <TransmissionModeBadge value={omim} key={omim} />
                  ))}
                </div>
              </div>
            </DescriptionSection>
            <DescriptionSection title={t('preview_sheet.interpretation_details.fields.classification_criteria')}>
              <div className="space-x-1">
                {(interpretation.data?.classification_criterias ?? []).map((criteria: string) => (
                  <Badge key={criteria} variant={getClassificationCriteriaColor(criteria)}>
                    {criteria}
                  </Badge>
                ))}
              </div>
            </DescriptionSection>
            <Separator />
            <div className="flex gap-6 text-sm text-muted-foreground font-sans">
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex items-center gap-1">
                    <StethoscopeIcon size="14" />
                    {interpretation.data?.updated_by_name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {t('preview_sheet.interpretation_details.fields.updated_by_name_tooltip')}
                </TooltipContent>
              </Tooltip>
              {interpretation.data?.updated_at && (
                <Tooltip>
                  <TooltipTrigger>
                    <span className="flex items-center gap-1">
                      <CalendarIcon size="14" />
                      <DateTime date={interpretation.data?.updated_at} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{t('preview_sheet.interpretation_details.fields.updated_at_tooltip')}</TooltipContent>
                </Tooltip>
              )}
            </div>

            <DescriptionSection title={t('preview_sheet.interpretation_details.fields.interpretation')}>
              <RichTextViewer className="max-h-[200px]" value={interpretation.data?.interpretation ?? ''} />
            </DescriptionSection>

            {(interpretation.data?.pubmed ?? []).length > 0 && (
              <>
                <Button variant="link" className="p-0" onClick={() => setIsPubmedOpen(true)}>
                  <LibraryBig />
                  {t('preview_sheet.interpretation_details.fields.references', {
                    count: interpretation.data?.pubmed?.length ?? 0,
                  })}
                </Button>
                <PubmedListDialog
                  pubmeds={interpretation.data?.pubmed ?? []}
                  open={isPubmedOpen}
                  onClose={() => setIsPubmedOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </SliderCard>
  );
}
export default GermlineSliderInterpretationDetailsCard;
