import { useState } from 'react';
import { FlipVertical2, Triangle, Users } from 'lucide-react';

import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import PedigreeFemaleNotAffectedIcon from '@/components/base/icons/pedigree-female-not-affected-icon';
import PedigreeMaleNotAffectedIcon from '@/components/base/icons/pedigree-male-not-affected-icon';
import ShapeTriangleUpIcon from '@/components/base/icons/shape-triangle-up-icon';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import IGVDialog from '@/components/feature/igv/igv-dialog';
import { useI18n } from '@/components/hooks/i18n';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';

import { DescriptionRow, DescriptionSection } from './description';
import PreviewCard from './preview-card';

type PreviewOccurrenceDetailsCardProps = {
  caseId: number;
  seqId: number;
  locus: string;
  start: number;
  chromosome: string;
  zygosity?: string;
  transmission?: string;
  parental_origin?: string;
  genotype_quality?: number;
  filter?: string;
  father_calls?: number[];
  mother_calls?: number[];
  ad_alt?: number;
  ad_total?: number;
};

const getFilterValue = (filter: string | undefined, t: (key: string) => string): React.ReactNode => {
  if (!filter) return <EmptyCell />;

  if (filter === 'PASS') {
    return <Badge variant="green">{t('preview_sheet.occurrence_details.sections.metrics.pass')}</Badge>;
  }
  return <Badge variant="red">{t('preview_sheet.occurrence_details.sections.metrics.fail')}</Badge>;
};

const PreviewOccurrenceDetailsCard = ({
  caseId,
  seqId,
  locus,
  start,
  chromosome,
  zygosity: zygosityProp,
  transmission,
  parental_origin,
  genotype_quality,
  filter,
  father_calls,
  mother_calls,
  ad_alt,
  ad_total,
}: PreviewOccurrenceDetailsCardProps) => {
  const { t } = useI18n();
  const [igvOpen, setIGVOpen] = useState<boolean>(false);

  const zygosity = zygosityProp ? zygosityProp : <EmptyCell />;
  const inheritance = transmission ? titleCase(replaceUnderscore(transmission)) : <EmptyCell />;
  const parentalOrigin = parental_origin ? titleCase(replaceUnderscore(parental_origin)) : <EmptyCell />;

  const genotypeQualityValue = (
    <span className="inline-flex gap-1 items-center">
      {genotype_quality && genotype_quality >= 20 ? (
        <Triangle strokeWidth={1.5} className={`w-[13px] h-[13px] text-opacity-50`} />
      ) : (
        <ShapeTriangleUpIcon className="w-[13px] h-[13px] text-destructive" />
      )}
      {genotype_quality ? genotype_quality : <EmptyCell />}
    </span>
  );

  const filterValue = getFilterValue(filter, t);

  return (
    <PreviewCard
      icon={Users}
      title={t('preview_sheet.occurrence_details.title')}
      actions={
        <IGVDialog
          open={igvOpen}
          setOpen={setIGVOpen}
          caseId={caseId}
          seqId={seqId}
          locus={locus}
          start={start}
          chromosome={chromosome}
          renderTrigger={handleOpen => (
            <Button variant="outline" size="xs" onClick={handleOpen}>
              <FlipVertical2 />
              {t('preview_sheet.occurrence_details.actions.view_in_igv')}
            </Button>
          )}
        />
      }
    >
      <div className="rounded-md w-full border">
        <div className="size-full">
          <div className="flex flex-wrap gap-4 sm:gap-20 items-start p-3 w-full">
            <div className="flex flex-col gap-4 grow max-w-full sm:max-w-72 min-w-56">
              <DescriptionSection title={t('preview_sheet.occurrence_details.sections.inheritance.title')}>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.inheritance.zygosity')}>
                  {zygosity}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.inheritance.inheritance')}>
                  {inheritance}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.inheritance.parental_origin')}>
                  {parentalOrigin}
                </DescriptionRow>
              </DescriptionSection>
              <DescriptionSection title="Family">
                <DescriptionRow
                  label={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex gap-1 items-center">
                          {t('preview_sheet.occurrence_details.sections.family.father_genotype')}{' '}
                          <PedigreeMaleNotAffectedIcon size={13} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {father_calls && father_calls[0] > 0
                          ? t('preview_sheet.occurrence_details.sections.family.affected_tooltip')
                          : t('preview_sheet.occurrence_details.sections.family.not_affected_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  }
                >
                  <span className="font-mono">0/1</span>
                </DescriptionRow>
                <DescriptionRow
                  label={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex gap-1 items-center">
                          {t('preview_sheet.occurrence_details.sections.family.mother_genotype')}{' '}
                          <PedigreeFemaleNotAffectedIcon size={13} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {mother_calls && mother_calls[0] > 0
                          ? t('preview_sheet.occurrence_details.sections.family.affected_tooltip')
                          : t('preview_sheet.occurrence_details.sections.family.not_affected_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  }
                >
                  <span className="font-mono">0/0</span>
                </DescriptionRow>
              </DescriptionSection>
            </div>
            <div className="flex flex-col gap-4 grow max-w-full sm:max-w-72 min-w-56">
              <DescriptionSection title="Metrics">
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.quality_depth')}>
                  <span className="font-mono">-</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.allele_depth_alt')}>
                  <span className="font-mono">{ad_alt ? ad_alt : <EmptyCell />}</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.total_depth_alt_ref')}>
                  <span className="font-mono">{ad_total ? ad_total : <EmptyCell />}</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.genotype_quality')}>
                  {genotypeQualityValue}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.filter')}>
                  {filterValue}
                </DescriptionRow>
              </DescriptionSection>
            </div>
          </div>
        </div>
      </div>
    </PreviewCard>
  );
};

export default PreviewOccurrenceDetailsCard;
