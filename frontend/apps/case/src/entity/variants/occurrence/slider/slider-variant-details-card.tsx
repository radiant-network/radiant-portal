/* eslint-disable complexity */
import { ReactNode, useCallback } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, AudioLines, Diamond } from 'lucide-react';

import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import ShapeDiamondIcon from '@/components/base/icons/shape-diamond-icon';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
import EmptyField from '@/components/base/information/empty-field';
import ExpandableList from '@/components/base/list/expandable-list';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { toExponentialNotationAtThreshold } from '@/components/lib/number-format';
import { cn } from '@/components/lib/utils';
import { DescriptionRow, DescriptionSection } from 'components/base/slider/description';
import SliderCard from 'components/base/slider/slider-card';
import TranscriptIdLink from 'components/base/variant/transcript-id-link';
import { getDbSnpUrl, getEnsemblUrl, getOmimOrgUrl } from 'components/base/variant/utils';

type SliderVariantDetailsCardProps = {
  data: ExpandedGermlineSNVOccurrence;
};

const SliderVariantDetailsCard = ({ data }: SliderVariantDetailsCardProps) => {
  const { t } = useI18n();

  return (
    <SliderCard
      icon={AudioLines}
      title={t('preview_sheet.variant_details.title')}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="xs" asChild>
            <a
              href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr${data.chromosome}%3A${data.start}-${data.start}`}
              target="_blank"
              rel="noreferrer"
            >
              {t('preview_sheet.variant_details.actions.ucsc')}
              <ArrowUpRight />
            </a>
          </Button>
          <Button variant="outline" size="xs" asChild>
            <a
              href={`https://www.ncbi.nlm.nih.gov/research/litvar2/docsum?text=${data.rsnumber}`}
              target="_blank"
              rel="noreferrer"
            >
              {t('preview_sheet.variant_details.actions.litvar')} <ArrowUpRight />
            </a>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <GeneCard data={data} />
        <PredictionCard data={data} />
        <ClinicalAssociationCard data={data} />
      </div>
    </SliderCard>
  );
};

const MAX_CLINICAL_ASSOCIATION = 3;

const ClinicalAssociationCard = ({ data }: { data: ExpandedGermlineSNVOccurrence }) => {
  const { t } = useI18n();

  const clinicalAssociationTitle = t('common.no_data_available');

  const omimCode = useCallback(
    (oc: string[]) =>
      oc.map((ic: string) => (
        <Badge variant="outline" key={ic}>
          {ic}
        </Badge>
      )),
    [],
  );

  const clinicalAssociationValue: ReactNode[] = [];
  data.omim_conditions?.forEach((oc, index) => {
    if (index === MAX_CLINICAL_ASSOCIATION) {
      clinicalAssociationValue.push(
        <AnchorLink
          component={Link}
          to={`/variants/entity/${data.locus_id}#evidenceAndConditions`}
          className="justify-start"
          size="sm"
        >
          <span className="max-w-72 overflow-hidden text-ellipsis">{t('common.actions.see_more')}</span>
        </AnchorLink>,
      );
      return;
    } else if (index > MAX_CLINICAL_ASSOCIATION) {
      return;
    }

    clinicalAssociationValue.push(
      <DescriptionRow
        label={
          oc.panel ? (
            <AnchorLink href={`https://www.omim.org/entry/${oc.omim_phenotype_id}`} target="_blank" size="sm">
              {oc.panel}
            </AnchorLink>
          ) : (
            clinicalAssociationTitle
          )
        }
      >
        {oc.inheritance_code ? (
          <div className="flex items-center gap-1">{omimCode(oc.inheritance_code)}</div>
        ) : (
          <EmptyField />
        )}
      </DescriptionRow>,
    );
  });

  return (
    <div className="rounded-md border border-border p-3">
      <DescriptionSection
        title={t('preview_sheet.variant_details.sections.clinical_associations.title')}
        fullWidth={false}
      >
        {clinicalAssociationValue.length ? (
          clinicalAssociationValue
        ) : (
          <div className="text-muted-foreground text-xs">
            {t('preview_sheet.variant_details.sections.clinical_associations.no_data')}
          </div>
        )}
      </DescriptionSection>
    </div>
  );
};

const PredictionCard = ({ data }: { data: ExpandedGermlineSNVOccurrence }) => {
  const { t } = useI18n();

  const affectedValue =
    data.pc_wgs_affected && data.pn_wgs_affected && data.pf_wgs_affected?.toExponential(2)
      ? `${data.pc_wgs_affected} / ${data.pn_wgs_affected} (${data.pf_wgs_affected?.toExponential(2)})`
      : '-';
  const affectedTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('preview_sheet.variant_details.sections.frequencies.affected')}
          <ShapeDiamondIcon className="size-[13px] text-red-500" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('occurrence_expand.frequencies.affected_tooltip')}</TooltipContent>
    </Tooltip>
  );

  const nonAffectedValue =
    data.pc_wgs_not_affected && data.pn_wgs_not_affected && data.pf_wgs_not_affected?.toExponential(2)
      ? `${data.pc_wgs_not_affected} / ${data.pn_wgs_not_affected} (${data.pf_wgs_not_affected?.toExponential(2)})`
      : '-';
  const nonAffectedTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('occurrence_expand.frequencies.non_affected')}
          <Diamond className="size-[13px] text-green-500" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('occurrence_expand.frequencies.non_affected_tooltip')}</TooltipContent>
    </Tooltip>
  );

  const functionalScores = [];

  // cadd phred
  if (data.cadd_phred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.cadd_phred')}>
        {data.cadd_phred.toExponential(2)}
      </DescriptionRow>,
    );
  }

  // cadd score
  if (data.cadd_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.cadd_raw')}>
        {data.cadd_score.toExponential(2)}
      </DescriptionRow>,
    );
  }

  // DANN score
  if (data.dann_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.dann')}>{data.dann_score}</DescriptionRow>,
    );
  }

  // LRT score
  if (data.lrt_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.lrt')}>
        {data.lrt_pred}
        {data.lrt_score && ` (${data.lrt_score})`}
      </DescriptionRow>,
    );
  }

  // sift
  if (data.sift_pred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.sift')}>
        {data.sift_pred}
        {data.sift_score && ` (${data.sift_score})`}
      </DescriptionRow>,
    );
  }

  // fathmm
  if (data.fathmm_pred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.fathmm')}>
        {data.fathmm_pred}
        {data.fathmm_score && ` (${data.fathmm_score})`}
      </DescriptionRow>,
    );
  }

  // revel score
  if (data.revel_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.revel')}>{data.revel_score}</DescriptionRow>,
    );
  }

  // PolyPhen-2 HVAR
  if (data.polyphen2_hvar_pred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.polyphen2_hvar')}>
        {data.polyphen2_hvar_pred}
        {data.polyphen2_hvar_score && ` (${data.polyphen2_hvar_score})`}
      </DescriptionRow>,
    );
  }

  return (
    <div className="flex flex-wrap gap-4 rounded-md border border-border p-3 sm:gap-20 w-full">
      <div className="flex flex-1 flex-col gap-4">
        <DescriptionSection title={t('preview_sheet.variant_details.sections.interpretations.title')}>
          {Object.keys(data.interpretation_classification_counts ?? {}).length ? (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.interpretations.my_network')}>
              {Object.entries(data.interpretation_classification_counts ?? {}).map(([key, count]) => (
                <ClassificationBadge key={key} value={key} count={count} abbreviated />
              ))}
            </DescriptionRow>
          ) : (
            <span className="text-muted-foreground text-xs">
              {t('preview_sheet.variant_details.sections.interpretations.no_data')}
            </span>
          )}
        </DescriptionSection>
        <DescriptionSection title={t('preview_sheet.variant_details.sections.classification.title')}>
          {Object.keys(data.exomiser_acmg_classification_counts ?? {}).length ? (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.classification.exomiser')}>
              {Object.entries(data.exomiser_acmg_classification_counts ?? {}).map(([key, count]) => (
                <ClassificationBadge key={key} value={key} count={count} abbreviated />
              ))}
            </DescriptionRow>
          ) : (
            <span className="text-muted-foreground text-xs">
              {t('preview_sheet.variant_details.sections.classification.no_data')}
            </span>
          )}
        </DescriptionSection>
        <DescriptionSection title={t('preview_sheet.variant_details.sections.gene.title')}>
          <DescriptionRow label={t('occurrence_expand.gene.pli')}>
            {data.gnomad_pli ? (
              <AnchorLink
                href={`https://gnomad.broadinstitute.org/gene/${data.ensembl_gene_id}?dataset=gnomad_r2_1`}
                target="_blank"
                size="sm"
              >
                {toExponentialNotationAtThreshold(data.gnomad_pli)}
              </AnchorLink>
            ) : (
              <EmptyField />
            )}
          </DescriptionRow>
          <DescriptionRow label={t('occurrence_expand.gene.loeuf')}>
            {data.gnomad_loeuf ? (
              <AnchorLink
                href={`https://gnomad.broadinstitute.org/gene/${data.ensembl_gene_id}?dataset=gnomad_r2_1`}
                target="_blank"
                size="sm"
              >
                {toExponentialNotationAtThreshold(data.gnomad_loeuf)}
              </AnchorLink>
            ) : (
              <EmptyField />
            )}
          </DescriptionRow>
          <DescriptionRow label={t('occurrence_expand.gene.splice_ai')}>
            {data.spliceai_type ? (
              <AnchorLink
                href={`https://spliceailookup.broadinstitute.org/#variant=${data.hgvsg}&hg=38`}
                target="_blank"
                size="sm"
              >
                <span className="text-xs text-muted-foreground">
                  {data.spliceai_ds}{' '}
                  {data.spliceai_type.map(v => (
                    <Badge key={v}>{v}</Badge>
                  ))}
                </span>
              </AnchorLink>
            ) : (
              <EmptyField />
            )}
          </DescriptionRow>
        </DescriptionSection>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <DescriptionSection title={t('preview_sheet.variant_details.sections.frequencies.title')}>
          <DescriptionRow label={affectedTitle}>{affectedValue}</DescriptionRow>
          <DescriptionRow label={nonAffectedTitle}>{nonAffectedValue}</DescriptionRow>
          <DescriptionRow label={t('preview_sheet.variant_details.sections.frequencies.gnomad')}>
            {data.gnomad_v3_af ? (
              <AnchorLink
                size="sm"
                href={`https://gnomad.broadinstitute.org/variant/${data.locus}?dataset=gnomad_r3`}
                target="_blank"
              >
                {toExponentialNotationAtThreshold(data.gnomad_v3_af)}
              </AnchorLink>
            ) : (
              <EmptyField />
            )}
          </DescriptionRow>
        </DescriptionSection>
        <DescriptionSection title={t('preview_sheet.variant_details.sections.functional_scores.title')}>
          <ExpandableList
            className="w-full"
            items={functionalScores}
            visibleCount={4}
            size="lg"
            emptyMessage={
              <div className="text-muted-foreground text-xs">
                {t('preview_sheet.variant_details.sections.functional_scores.no_data')}
              </div>
            }
          />
        </DescriptionSection>
      </div>
    </div>
  );
};
const GeneCard = ({ data }: { data: ExpandedGermlineSNVOccurrence }) => {
  const { t } = useI18n();

  const pickedConsequence = data?.picked_consequences?.[0];
  const hasGene = !!data.symbol;

  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex flex-wrap gap-4 sm:gap-20 w-full">
        {hasGene && (
          <div className="flex flex-1 flex-col grow gap-2">
            <AnchorLink className="font-semibold text-lg" external href={getOmimOrgUrl({ symbol: data.symbol! })}>
              {data.symbol}
            </AnchorLink>
            {data.aa_change && <div className="font-mono font-semibold text-sm">{data.aa_change}</div>}
            {data.ensembl_gene_id && (
              <AnchorLink target="_blank" className="text-sm" external href={getEnsemblUrl(data.ensembl_gene_id)}>
                {t('preview_sheet.variant_details.actions.ensembl')}
              </AnchorLink>
            )}
          </div>
        )}
        <div className={cn('flex flex-col gap-2', { 'flex-1 grow': hasGene })}>
          {data.vep_impact && pickedConsequence && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.consequence')}>
              <ConsequenceIndicator vepImpact={data.vep_impact} consequence={pickedConsequence} size="sm" />
            </DescriptionRow>
          )}
          {data.dna_change && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.cdna_change')}>
              <div className="font-mono">{data.dna_change}</div>
            </DescriptionRow>
          )}
          {data.transcript_id && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.transcript_id')}>
              <TranscriptIdLink
                transcriptId={data.transcript_id}
                isManeSelect={data.is_mane_select}
                isManePlus={false}
                isCanonical={data.is_canonical}
                linkClassName="text-primary"
              />
            </DescriptionRow>
          )}
          {data.exon_rank && data.exon_total && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.exon')}>
              <div className="font-mono">
                {data.exon_rank}/{data.exon_total}
              </div>
            </DescriptionRow>
          )}
          {data.rsnumber && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.dbsnp_id')}>
              <AnchorLink href={getDbSnpUrl(data.rsnumber)} mono size="sm" target="_blank" rel="noreferrer">
                {data.rsnumber}
              </AnchorLink>
            </DescriptionRow>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderVariantDetailsCard;
