import { useEffect, useState } from 'react';
import { CalendarIcon, ClipboardList, LibraryBig, SquarePen, StethoscopeIcon } from 'lucide-react';
import useSWR from 'swr';

import { InterpretationGermline } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import TransmissionModeBadge from '@/components/base/badges/transmission-mode-badge';
import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import DateTime from '@/components/base/date/datetime';
import EmptyField from '@/components/base/information/empty-field';
import { getClassificationCriteriaColor } from '@/components/base/interpretation/data';
import { useInterpretationHelper } from '@/components/base/interpretation/hook';
import InterpretationDialog from '@/components/base/interpretation/interpretation-dialog';
import AnchorLink from '@/components/base/navigation/anchor-link';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import PubmedListDialog from '@/components/base/pubmed/pubmed-list-dialog';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { DescriptionSection } from '@/components/base/slider/description';
import SliderCard from '@/components/base/slider/slider-card';
import TranscriptIdLink from '@/components/base/variant/transcript-id-link';
import { getOmimOrgUrl } from '@/components/base/variant/utils';
import { useI18n } from '@/components/hooks/i18n';

type SliderInterpretationDetailsCardProps = {
  seqId: number;
  caseId: number;
  locusId: string;
  symbol?: string;
  transcriptId?: string;
  isCanonical?: boolean;
  isManeSelect?: boolean;
  isManePlus?: boolean;
  canEditInterpretation?: boolean;
  onInterpretationSaved?: () => void;
};

function SliderInterpretationDetailsCard({
  seqId,
  caseId,
  locusId,
  isManeSelect,
  symbol,
  isManePlus,
  isCanonical,
  transcriptId,
  canEditInterpretation = false,
  onInterpretationSaved,
}: SliderInterpretationDetailsCardProps) {
  const { t } = useI18n();
  const [isPubmedOpen, setIsPubmedOpen] = useState<boolean>(false);

  const { fetch } = useInterpretationHelper({
    caseId,
    seqId,
    locusId,
    transcriptId,
    isSomatic: false,
  });
  const interpretationUniqueKey = `interpretation-details-${seqId}-${locusId}-${transcriptId}`;
  const fetchInterpretation = useSWR<InterpretationGermline>(interpretationUniqueKey, fetch, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });
  const { data: interpretation } = fetchInterpretation;

  useEffect(() => {
    fetchInterpretation.mutate();
  }, []);

  if (fetchInterpretation.isLoading || fetchInterpretation.isValidating) {
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
    <SliderCard
      icon={ClipboardList}
      title={t('preview_sheet.interpretation_details.title')}
      actions={
        canEditInterpretation && (
          <InterpretationDialog
            seqId={seqId}
            locusId={locusId}
            transcriptId={transcriptId}
            handleSaveCallback={() => {
              fetchInterpretation.mutate();
              onInterpretationSaved?.();
            }}
            renderTrigger={handleOpen => (
              <Button size="sm" onClick={handleOpen}>
                <SquarePen />
                {t('common.edit')}
              </Button>
            )}
          />
        )
      }
    >
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
                  <ClassificationBadge value={interpretation?.classification ?? ''} size="lg" />
                </div>
              </div>
            </div>
            <DescriptionSection title={t('preview_sheet.interpretation_details.fields.primary_condition')}>
              <div className="flex gap-2">
                <PhenotypeConditionLink
                  className="capitalize"
                  name={interpretation?.condition_name}
                  code={interpretation?.condition}
                  showCode={false}
                />
                <div className="flex gap-1">
                  {(interpretation?.transmission_modes ?? []).map(omim => (
                    <TransmissionModeBadge value={omim} key={omim} />
                  ))}
                </div>
              </div>
            </DescriptionSection>
            <DescriptionSection title={t('preview_sheet.interpretation_details.fields.classification_criteria')}>
              <div className="space-x-1">
                {(interpretation?.classification_criterias ?? []).map((criteria: string) => (
                  <Badge key={criteria} variant={getClassificationCriteriaColor(criteria)}>
                    {criteria}
                  </Badge>
                ))}
              </div>
            </DescriptionSection>
            <Separator />
            <div className="flex gap-6 text-sm text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <StethoscopeIcon size="14" />
                {interpretation?.updated_by_name}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon size="14" />
                {interpretation?.updated_at && <DateTime date={interpretation.updated_at} />}
              </span>
            </div>

            <DescriptionSection title={t('preview_sheet.interpretation_details.fields.interpretation')}>
              <RichTextViewer className="max-h-[200px]" value={interpretation?.interpretation ?? ''} />
            </DescriptionSection>

            {(interpretation?.pubmed ?? []).length > 0 && (
              <>
                <Button variant="link" className="p-0" onClick={() => setIsPubmedOpen(true)}>
                  <LibraryBig />
                  {t('preview_sheet.interpretation_details.fields.references', {
                    count: interpretation?.pubmed?.length ?? 0,
                  })}
                </Button>
                <PubmedListDialog
                  pubmeds={interpretation?.pubmed ?? []}
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
export default SliderInterpretationDetailsCard;
