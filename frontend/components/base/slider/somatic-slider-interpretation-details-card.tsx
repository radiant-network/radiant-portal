import { useEffect, useState } from 'react';
import { CalendarIcon, ClipboardList, LibraryBig, StethoscopeIcon } from 'lucide-react';
import useSWR from 'swr';

import { InterpretationSomatic } from '@/api/api';
import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import DateTime from '@/components/base/date/datetime';
import EmptyField from '@/components/base/information/empty-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
import PubmedListDialog from '@/components/base/pubmed/pubmed-list-dialog';
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

import ClassificationBadge from '../badges/classification-badge';
import { getOncogenicityClassificationCriteriaColor } from '../classifications/oncogenicity';
import { Badge } from '../shadcn/badge';

type SliderInterpretationDetailsCardProps = {
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
  const response = await interpretationApi.getInterpretationSomatic(
    input.caseId,
    input.seqId,
    input.locusId,
    input.transcriptId,
  );
  return response.data;
}

function SomaticSliderInterpretationDetailsCard({
  actions,
  seqId,
  caseId,
  locusId,
  isManeSelect,
  symbol,
  isManePlus,
  isCanonical,
  transcriptId,
}: SliderInterpretationDetailsCardProps) {
  const { t } = useI18n();
  const [isPubmedOpen, setIsPubmedOpen] = useState<boolean>(false);

  const interpretation = useSWR<InterpretationSomatic>(
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
              <div className="flex gap-6">
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
                  <ClassificationBadge value={interpretation.data?.oncogenicity ?? ''} isSomatic={true} size="lg" />
                </div>
              </div>
            </div>
            {/* TODO: waiting back fix to display the real tumoral type */}
            {interpretation.data?.tumoral_type && (
              <DescriptionSection title={t('preview_sheet.interpretation_details.fields.tumoral_type')}>
                <div className="flex gap-2">
                  <AnchorLink
                    href={`http://purl.obolibrary.org/obo/MONDO_${interpretation.data?.tumoral_type.replace('MONDO:', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                  >
                    {interpretation.data?.tumoral_type}
                  </AnchorLink>
                </div>
              </DescriptionSection>
            )}
            <div className="flex w-full">
              <DescriptionSection title={t('preview_sheet.interpretation_details.fields.classification_criteria')}>
                <div className="space-x-1">
                  {(interpretation.data?.oncogenicity_classification_criterias ?? []).map((criteria: string) => (
                    <Badge key={criteria} variant={getOncogenicityClassificationCriteriaColor(criteria)}>
                      {criteria}
                    </Badge>
                  ))}
                </div>
              </DescriptionSection>
              <DescriptionSection title={t('preview_sheet.interpretation_details.fields.clinical_utility')}>
                {interpretation.data?.clinical_utility ? (
                  <Badge>
                    {t(`preview_sheet.interpretation_details.clinical_utility.${interpretation.data.clinical_utility}`)}
                  </Badge>
                ) : (
                  <EmptyField />
                )}
              </DescriptionSection>
            </div>
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
export default SomaticSliderInterpretationDetailsCard;
