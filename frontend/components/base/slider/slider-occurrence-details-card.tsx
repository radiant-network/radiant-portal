import { useState } from 'react';
import { FlipVertical2, Triangle, Users } from 'lucide-react';

import PedigreeFemaleNotAffectedIcon from '@/components/base/icons/pedigree-female-not-affected-icon';
import PedigreeMaleNotAffectedIcon from '@/components/base/icons/pedigree-male-not-affected-icon';
import ShapeTriangleUpIcon from '@/components/base/icons/shape-triangle-up-icon';
import IGVDialog from '@/components/base/igv/igv-dialog';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { DescriptionRow, DescriptionSection } from '@/components/base/slider/description';
import SliderCard from '@/components/base/slider/slider-card';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';

import EmptyField from '../information/empty-field';

type SliderOccurrenceDetailsCardProps = {
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
  relationshipToProband?: string;
  father_calls?: number[];
  mother_calls?: number[];
  ad_alt?: number;
  ad_total?: number;
  enableIGV?: boolean;
};

function getFilterValue(filter: string | undefined, t: (key: string) => string): React.ReactNode {
  if (!filter) return <EmptyField />;

  if (filter === 'PASS') {
    return <Badge variant="green">{t('preview_sheet.occurrence_details.sections.metrics.pass')}</Badge>;
  }
  return <Badge variant="red">{t('preview_sheet.occurrence_details.sections.metrics.fail')}</Badge>;
}

function getGenotypeQuality(genotypeQuality?: number): React.ReactNode {
  if (!genotypeQuality || genotypeQuality <= 0) return <EmptyField />;

  return (
    <span className="inline-flex gap-1 items-center">
      {genotypeQuality >= 20 ? (
        <Triangle strokeWidth={1.5} className={`w-[13px] h-[13px] text-opacity-50`} />
      ) : (
        <ShapeTriangleUpIcon className="w-[13px] h-[13px] text-destructive" />
      )}
      {thousandNumberFormat(genotypeQuality)}
    </span>
  );
}

const SliderOccurrenceDetailsCard = ({
  caseId,
  seqId,
  locus,
  start,
  chromosome,
  zygosity,
  transmission,
  parental_origin,
  genotype_quality,
  relationshipToProband,
  filter,
  father_calls,
  mother_calls,
  ad_alt,
  ad_total,
  enableIGV = false,
}: SliderOccurrenceDetailsCardProps) => {
  const { t } = useI18n();
  const [igvOpen, setIGVOpen] = useState<boolean>(false);

  const filterValue = getFilterValue(filter, t);

  let actions = undefined;
  if (enableIGV) {
    actions = (
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
    );
  }

  return (
    <SliderCard icon={Users} title={t('preview_sheet.occurrence_details.title')} actions={actions}>
      <div className="rounded-md w-full border">
        <div className="size-full">
          <div className="flex flex-wrap gap-4 sm:gap-20 items-start p-3 w-full">
            <div className="flex flex-col gap-4 grow max-w-full sm:max-w-72 min-w-56">
              <DescriptionSection
                title={t('preview_sheet.occurrence_details.sections.inheritance.title')}
                values={[zygosity, transmission, parental_origin]}
              >
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.inheritance.zygosity')}>
                  {zygosity ? <Badge variant="outline">{zygosity}</Badge> : <EmptyField />}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.inheritance.inheritance')}>
                  {transmission ? (
                    <Badge variant="outline">{titleCase(replaceUnderscore(transmission))}</Badge>
                  ) : (
                    <EmptyField />
                  )}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.inheritance.parental_origin')}>
                  {parental_origin ? (
                    <Badge variant="outline">{titleCase(replaceUnderscore(parental_origin))}</Badge>
                  ) : (
                    <EmptyField />
                  )}
                </DescriptionRow>
              </DescriptionSection>
              {/* only proband has father and mother call */}
              {relationshipToProband === 'proband' && (
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
                    {father_calls ? (
                      <span className="font-mono">{`${father_calls[0]}/${father_calls[1]}`}</span>
                    ) : (
                      <EmptyField />
                    )}
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
                    {mother_calls ? (
                      <span className="font-mono">{`${mother_calls[0]}/${mother_calls[1]}`}</span>
                    ) : (
                      <EmptyField />
                    )}
                  </DescriptionRow>
                </DescriptionSection>
              )}
            </div>

            <div className="flex flex-col gap-4 grow max-w-full sm:max-w-72 min-w-56">
              <DescriptionSection title="Metrics" values={[ad_alt, ad_total, genotype_quality, filter]}>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.quality_depth')}>
                  <EmptyField />
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.allele_depth_alt')}>
                  <span className="font-mono">{ad_alt ? thousandNumberFormat(ad_alt) : <EmptyField />}</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.total_depth_alt_ref')}>
                  <span className="font-mono">{ad_total ? thousandNumberFormat(ad_total) : <EmptyField />}</span>
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.genotype_quality')}>
                  {getGenotypeQuality(genotype_quality)}
                </DescriptionRow>
                <DescriptionRow label={t('preview_sheet.occurrence_details.sections.metrics.filter')}>
                  {filterValue}
                </DescriptionRow>
              </DescriptionSection>
            </div>
          </div>
        </div>
      </div>
    </SliderCard>
  );
};

export default SliderOccurrenceDetailsCard;
