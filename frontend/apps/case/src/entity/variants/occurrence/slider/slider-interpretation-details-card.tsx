import { useEffect, useState } from 'react';
import { Calendar, ClipboardList, LibraryBig, SquarePen, Stethoscope } from 'lucide-react';
import useSWR from 'swr';

import { GermlineSNVOccurrence, InterpretationGermline } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import DateTime from '@/components/base/date/datetime';
import EmptyField from '@/components/base/information/empty-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
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
import { useCaseIdFromParam } from '@/utils/helper';

import { getClassificationCriteriaColor } from '../../interpretation/data';
import { useInterpretationHelper } from '../../interpretation/hook';
import InterpretationDialog from '../../interpretation/interpretation-dialog';
import { useOccurrenceListContext } from '../hooks/use-occurrences-list';

type SliderInterpretationDetailsCardProps = {
  occurrence: GermlineSNVOccurrence;
};

function SliderInterpretationDetailsCard({ occurrence }: SliderInterpretationDetailsCardProps) {
  const { t } = useI18n();
  const caseId = useCaseIdFromParam();
  const { mutate, loading } = useOccurrenceListContext();
  const [isPubmedOpen, setIsPubmedOpen] = useState<boolean>(false);

  const { fetch } = useInterpretationHelper(caseId, occurrence, false);
  const interpretationUniqueKey = `interpretation-details-${occurrence.seq_id}-${occurrence.locus_id}-${occurrence.transcript_id}`;
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
        <InterpretationDialog
          occurrence={occurrence}
          handleSaveCallback={() => {
            fetchInterpretation.mutate();
            mutate();
          }}
          renderTrigger={handleOpen => (
            <Button loading={loading} size="sm" onClick={handleOpen}>
              <SquarePen />
              {t('common.edit')}
            </Button>
          )}
        />
      }
    >
      <div className="rounded-md w-full border">
        <div className="size-full">
          <div className="flex flex-col flex-wrap gap-4 items-start p-3 w-full">
            <div className="flex grow w-full">
              <div className="flex gap-6">
                <DescriptionSection title={t('preview_sheet.interpretation_details.fields.gene')} fullWidth={false}>
                  {occurrence?.symbol ? (
                    <AnchorLink
                      href={getOmimOrgUrl({ symbol: occurrence.symbol })}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      size="sm"
                    >
                      {occurrence.symbol}
                    </AnchorLink>
                  ) : (
                    <EmptyField />
                  )}
                </DescriptionSection>
                <DescriptionSection
                  title={t('preview_sheet.interpretation_details.fields.transcript')}
                  fullWidth={false}
                >
                  {occurrence?.transcript_id && (
                    <TranscriptIdLink
                      transcriptId={occurrence.transcript_id}
                      isCanonical={occurrence.is_canonical}
                      isManeSelect={occurrence.is_mane_select}
                      isManePlus={occurrence.is_mane_plus}
                      linkClassName="text-sm text-primary"
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
              <div className="flex gap-2">{interpretation?.condition}</div>
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
            <div className="flex gap-6">
              <div className="flex gap-1 text-sm text-foreground font-mono">
                <Stethoscope size="14" />
                {interpretation?.updated_by_name}
              </div>
              <div className="flex gap-1 text-sm text-foreground font-mono">
                <Calendar size="14" />
                {interpretation?.updated_at && <DateTime date={interpretation.updated_at} />}
              </div>
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
