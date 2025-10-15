import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { FlipVertical2, Triangle } from 'lucide-react';
import { Users } from 'lucide-react';
import PedigreeMaleNotAffectedIcon from '@/components/base/icons/pedigree-male-not-affected-icon';
import PedigreeFemaleNotAffectedIcon from '@/components/base/icons/pedigree-female-not-affected-icon';
import { useI18n } from '@/components/hooks/i18n';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { DescriptionRow, DescriptionSection } from './description';
import { ExpandedGermlineSNVOccurrence, GermlineSNVOccurrence } from '@/api/api';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';
import OccurrenceSheetCard from './occurence-sheet-card';
import IGVDialog from '../../igv/igv-dialog';
import { useState } from 'react';
import ShapeTriangleUpIcon from '@/components/base/icons/shape-triangle-up-icon';

const OccurrenceSheetDetailsCard = ({
  data,
  occurrence,
}: {
  data: ExpandedGermlineSNVOccurrence;
  occurrence: GermlineSNVOccurrence;
}) => {
  const { t } = useI18n();
  const [igvOpen, setIGVOpen] = useState<boolean>(false);

  const zygosity = data.zygosity ? data.zygosity : '-';
  const inheritance = data.transmission ? titleCase(replaceUnderscore(data.transmission)) : '-';
  const parentalOrigin = data.parental_origin ? titleCase(replaceUnderscore(data.parental_origin)) : '-';

  const genotypeQualityValue = (
    <span className="inline-flex gap-1 items-center">
      {data?.genotype_quality >= 20 ? (
        <Triangle strokeWidth={1.5} className={`w-[13px] h-[13px] text-opacity-50`} />
      ) : (
        <ShapeTriangleUpIcon className="w-[13px] h-[13px] text-destructive" />
      )}
      {data?.genotype_quality ? data?.genotype_quality : '-'}
    </span>
  );

  const filterValue = data.filter ? (
    data.filter === 'PASS' ? (
      <Badge variant="green">{t('preview_sheet.occurence_details.sections.metrics.pass')}</Badge>
    ) : (
      <Badge variant="red">{t('preview_sheet.occurence_details.sections.metrics.fail')}</Badge>
    )
  ) : (
    '-'
  );

  return (
    <OccurrenceSheetCard
      icon={Users}
      title={t('preview_sheet.occurence_details.title')}
      actions={
        <IGVDialog
          open={igvOpen}
          setOpen={setIGVOpen}
          occurrence={occurrence}
          renderTrigger={handleOpen => (
            <Button variant="outline" size="sm" onClick={handleOpen}>
              <FlipVertical2 />
              {t('preview_sheet.occurence_details.actions.view_in_igv')}
            </Button>
          )}
        />
      }
    >
      <div className="rounded-md w-full border">
        <div className="size-full">
          <div className="flex flex-wrap gap-20 items-start p-3 w-full">
            {/* Inheritance & Family Section */}
            <div className="flex flex-col gap-4 grow max-w-72 min-w-56">
              <DescriptionSection title={t('preview_sheet.occurence_details.sections.inheritance.title')}>
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.inheritance.zygosity')}>
                  {zygosity}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.inheritance.inheritance')}>
                  {inheritance}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.inheritance.parental_origin')}>
                  {parentalOrigin}
                </DescriptionRow>
              </DescriptionSection>
              <DescriptionSection title="Family">
                <DescriptionRow
                  label={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex gap-1 items-center">
                          {t('preview_sheet.occurence_details.sections.family.father_genotype')}{' '}
                          <PedigreeMaleNotAffectedIcon size={13} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {data.father_calls && data.father_calls[0] > 0
                          ? t('preview_sheet.occurence_details.sections.family.affected_tooltip')
                          : t('preview_sheet.occurence_details.sections.family.not_affected_tooltip')}
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
                          {t('preview_sheet.occurence_details.sections.family.mother_genotype')}{' '}
                          <PedigreeFemaleNotAffectedIcon size={13} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {data.mother_calls && data.mother_calls[0] > 0
                          ? t('preview_sheet.occurence_details.sections.family.affected_tooltip')
                          : t('preview_sheet.occurence_details.sections.family.not_affected_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  }
                >
                  <span className="font-mono">0/0</span>
                </DescriptionRow>
              </DescriptionSection>
            </div>

            {/* Metrics Section */}
            <div className="flex flex-col gap-4 grow max-w-72 min-w-56">
              <DescriptionSection title="Metrics">
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.metrics.quality_depth')}>
                  <span className="font-mono">-</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.metrics.allele_depth_alt')}>
                  <span className="font-mono">{data?.ad_alt ? data?.ad_alt : '-'}</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.metrics.total_depth_alt_ref')}>
                  <span className="font-mono">{data?.ad_total ? data?.ad_total : '-'}</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.metrics.genotype_quality')}>
                  {genotypeQualityValue}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurence_details.sections.metrics.filter')}>
                  {filterValue}
                </DescriptionRow>
              </DescriptionSection>
            </div>
          </div>
        </div>
      </div>
    </OccurrenceSheetCard>
  );
};

export default OccurrenceSheetDetailsCard;
