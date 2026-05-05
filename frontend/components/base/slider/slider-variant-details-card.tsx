/* eslint-disable complexity */
import { ReactNode, useCallback } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, AudioLines, Diamond, Flame } from 'lucide-react';

import { OmimGenePanel, VepImpact } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import ShapeDiamondIcon from '@/components/base/icons/shape-diamond-icon';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
import EmptyField from '@/components/base/information/empty-field';
import ExpandableList from '@/components/base/list/expandable-list';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { DescriptionRow, DescriptionSection } from '@/components/base/slider/description';
import SliderCard from '@/components/base/slider/slider-card';
import TranscriptIdLink from '@/components/base/variant/transcript-id-link';
import { getDbSnpUrl, getEnsemblUrl, getOmimOrgUrl } from '@/components/base/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import { toExponentialNotation, toExponentialNotationAtThreshold } from '@/components/lib/number-format';
import { cn } from '@/components/lib/utils';

const MAX_CLINICAL_ASSOCIATION = 3;

type SliderVariantType = {
  type: 'somatic' | 'germline';
};

type SliderVariantDetailsCardProps = ClinicalAssociationCardProps &
  PredictionCardProps &
  SliderVariantType &
  GeneCardProps & {
    chromosome?: string;
    start?: number;
    end?: number;
  };

/**
 * Props are volontary used instead of GermlineSnvOccurrence and SomaticSnvOccurrence.
 * To prevent relentless type checking in the code. It lead to more props but it's still easier
 * to read.
 */
const SliderVariantDetailsCard = ({
  type,
  chromosome,
  start,
  end,
  symbol,
  aa_change,
  vep_impact,
  picked_consequences,
  dna_change,
  transcript_id,
  is_mane_select,
  is_canonical,
  exon_rank,
  exon_total,
  rsnumber,
  omim_conditions,
  locus_id,
  germline_pc_wgs_affected,
  germline_pn_wgs_affected,
  germline_pf_wgs_affected,
  germline_pc_wgs_not_affected,
  germline_pn_wgs_not_affected,
  germline_pf_wgs_not_affected,
  somatic_pc_tn_wgs,
  somatic_pn_tn_wgs,
  somatic_pf_tn_wgs,
  cadd_phred,
  cadd_score,
  lrt_pred,
  dann_score,
  lrt_score,
  sift_pred,
  sift_score,
  fathmm_pred,
  fathmm_score,
  revel_score,
  polyphen2_hvar_pred,
  polyphen2_hvar_score,
  clinvar,
  exomiser_acmg_classification_counts,
  interpretation_classification_counts,
  gnomad_pli,
  gnomad_loeuf,
  ensembl_gene_id,
  spliceai_type,
  spliceai_ds,
  hgvsg,
  gnomad_v3_af,
  locus,
  locusId,
  hotspot,
}: SliderVariantDetailsCardProps) => {
  const { t } = useI18n();

  return (
    <SliderCard
      icon={AudioLines}
      title={t('preview_sheet.variant_details.title')}
      actions={
        <div className="flex gap-2">
          {chromosome && start && end && (
            <Button variant="outline" size="xs" asChild>
              <a
                href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr${chromosome}%3A${start}-${end}`}
                target="_blank"
                rel="noreferrer"
              >
                {t('preview_sheet.variant_details.actions.ucsc')}
                <ArrowUpRight />
              </a>
            </Button>
          )}
          {rsnumber !== undefined && rsnumber.length > 0 && (
            <Button variant="outline" size="xs" asChild>
              <a
                href={`https://www.ncbi.nlm.nih.gov/research/litvar2/docsum?text=${rsnumber}`}
                target="_blank"
                rel="noreferrer"
              >
                {t('preview_sheet.variant_details.actions.litvar')} <ArrowUpRight />
              </a>
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <GeneCard
          symbol={symbol}
          aa_change={aa_change}
          ensembl_gene_id={ensembl_gene_id}
          vep_impact={vep_impact}
          picked_consequences={picked_consequences}
          dna_change={dna_change}
          transcript_id={transcript_id}
          is_mane_select={is_mane_select}
          is_canonical={is_canonical}
          exon_rank={exon_rank}
          exon_total={exon_total}
          rsnumber={rsnumber}
        />
        <PredictionCard
          type={type}
          germline_pc_wgs_affected={germline_pc_wgs_affected}
          germline_pn_wgs_affected={germline_pn_wgs_affected}
          germline_pf_wgs_affected={germline_pf_wgs_affected}
          germline_pc_wgs_not_affected={germline_pc_wgs_not_affected}
          germline_pn_wgs_not_affected={germline_pn_wgs_not_affected}
          germline_pf_wgs_not_affected={germline_pf_wgs_not_affected}
          somatic_pc_tn_wgs={somatic_pc_tn_wgs}
          somatic_pn_tn_wgs={somatic_pn_tn_wgs}
          somatic_pf_tn_wgs={somatic_pf_tn_wgs}
          cadd_phred={cadd_phred}
          cadd_score={cadd_score}
          dann_score={dann_score}
          lrt_pred={lrt_pred}
          lrt_score={lrt_score}
          sift_pred={sift_pred}
          sift_score={sift_score}
          fathmm_pred={fathmm_pred}
          fathmm_score={fathmm_score}
          revel_score={revel_score}
          polyphen2_hvar_pred={polyphen2_hvar_pred}
          polyphen2_hvar_score={polyphen2_hvar_score}
          clinvar={clinvar}
          exomiser_acmg_classification_counts={exomiser_acmg_classification_counts}
          interpretation_classification_counts={interpretation_classification_counts}
          gnomad_pli={gnomad_pli}
          gnomad_loeuf={gnomad_loeuf}
          ensembl_gene_id={ensembl_gene_id}
          spliceai_type={spliceai_type}
          spliceai_ds={spliceai_ds}
          hgvsg={hgvsg}
          gnomad_v3_af={gnomad_v3_af}
          locus={locus}
          locusId={locusId}
          hotspot={hotspot}
        />
        <ClinicalAssociationCard omim_conditions={omim_conditions} locus_id={locus_id} />
      </div>
    </SliderCard>
  );
};

type ClinicalAssociationCardProps = {
  locus_id?: string;
  omim_conditions?: OmimGenePanel[];
};
const ClinicalAssociationCard = ({ omim_conditions, locus_id }: ClinicalAssociationCardProps) => {
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
  omim_conditions?.forEach((oc, index) => {
    if (index > MAX_CLINICAL_ASSOCIATION) return;

    if (index === MAX_CLINICAL_ASSOCIATION) {
      clinicalAssociationValue.push(
        <AnchorLink
          component={Link}
          to={`/variants/entity/${locus_id}?tab=evidenceAndConditions`}
          className="justify-start"
          size="sm"
        >
          <span className="max-w-72 overflow-hidden text-ellipsis">{t('common.actions.see_more')}</span>
        </AnchorLink>,
      );
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

type PredictionCardProps = SliderVariantType & {
  germline_pc_wgs_affected?: number;
  germline_pn_wgs_affected?: number;
  germline_pf_wgs_affected?: number;
  germline_pc_wgs_not_affected?: number;
  germline_pn_wgs_not_affected?: number;
  germline_pf_wgs_not_affected?: number;
  somatic_pc_tn_wgs?: number;
  somatic_pn_tn_wgs?: number;
  somatic_pf_tn_wgs?: number;
  cadd_phred?: number;
  cadd_score?: number;
  dann_score?: number;
  lrt_pred?: string;
  lrt_score?: number;
  sift_pred?: string;
  sift_score?: number;
  fathmm_pred?: string;
  fathmm_score?: number;
  revel_score?: number;
  polyphen2_hvar_pred?: string;
  polyphen2_hvar_score?: number;
  clinvar?: string[];
  exomiser_acmg_classification_counts?: Record<string, number>;
  interpretation_classification_counts?: Record<string, number>;
  gnomad_pli?: number;
  gnomad_loeuf?: number;
  ensembl_gene_id?: string;
  spliceai_type?: string[];
  spliceai_ds?: number;
  hgvsg?: string;
  gnomad_v3_af?: number;
  locus?: string;
  locusId?: string;
  hotspot?: boolean;
};
const PredictionCard = ({
  type,
  germline_pc_wgs_affected,
  germline_pn_wgs_affected,
  germline_pf_wgs_affected,
  germline_pc_wgs_not_affected,
  germline_pn_wgs_not_affected,
  germline_pf_wgs_not_affected,
  somatic_pc_tn_wgs,
  somatic_pn_tn_wgs,
  somatic_pf_tn_wgs,
  cadd_phred,
  cadd_score,
  lrt_pred,
  dann_score,
  lrt_score,
  sift_pred,
  sift_score,
  fathmm_pred,
  fathmm_score,
  revel_score,
  polyphen2_hvar_pred,
  polyphen2_hvar_score,
  clinvar,
  exomiser_acmg_classification_counts,
  interpretation_classification_counts,
  gnomad_pli,
  gnomad_loeuf,
  ensembl_gene_id,
  spliceai_type,
  spliceai_ds,
  hgvsg,
  gnomad_v3_af,
  locus,
  locusId,
  hotspot,
}: PredictionCardProps) => {
  const { t } = useI18n();

  // Frequencies differ from somatic to germline
  const frequencies = [];
  if (type == 'somatic') {
    // Tumor-Normal
    frequencies.push(
      <DescriptionRow
        label={
          <span className="inline-flex gap-1 items-center">
            {t('preview_sheet.variant_details.sections.frequencies.tn')}
          </span>
        }
      >
        {somatic_pc_tn_wgs && somatic_pn_tn_wgs && somatic_pf_tn_wgs?.toExponential(2) ? (
          <AnchorLink size="sm" href={`/variants/entity/${locusId}?tab=patients&cases=OtherCases`} target="_blank">
            {somatic_pc_tn_wgs} / {somatic_pn_tn_wgs} ({somatic_pf_tn_wgs?.toExponential(2)})
          </AnchorLink>
        ) : (
          <EmptyField />
        )}
      </DescriptionRow>,
    );
  } else {
    // Germline Affected
    frequencies.push(
      <DescriptionRow
        label={
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex gap-1 items-center">
                {t('preview_sheet.variant_details.sections.frequencies.affected')}
                <ShapeDiamondIcon className="size-[13px] text-red-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent>{t('occurrence_expand.frequencies.affected_tooltip')}</TooltipContent>
          </Tooltip>
        }
      >
        {germline_pc_wgs_affected && germline_pn_wgs_affected && germline_pf_wgs_affected?.toExponential(2) ? (
          `${germline_pc_wgs_affected} / ${germline_pn_wgs_affected} (${germline_pf_wgs_affected?.toExponential(2)})`
        ) : (
          <EmptyField />
        )}
      </DescriptionRow>,
    );

    // Germline Non Affected
    frequencies.push(
      <DescriptionRow
        label={
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex gap-1 items-center">
                {t('occurrence_expand.frequencies.non_affected')}
                <Diamond className="size-[13px] text-green-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent>{t('occurrence_expand.frequencies.non_affected_tooltip')}</TooltipContent>
          </Tooltip>
        }
      >
        {germline_pc_wgs_not_affected &&
        germline_pn_wgs_not_affected &&
        germline_pf_wgs_not_affected?.toExponential(2) ? (
          `${germline_pc_wgs_not_affected} / ${germline_pn_wgs_not_affected} (${germline_pf_wgs_not_affected?.toExponential(2)})`
        ) : (
          <EmptyField />
        )}
      </DescriptionRow>,
    );

    // GnomAD
    frequencies.push(
      <DescriptionRow label={t('preview_sheet.variant_details.sections.frequencies.gnomad')}>
        {gnomad_v3_af ? (
          <AnchorLink
            size="sm"
            href={`https://gnomad.broadinstitute.org/variant/${locus}?dataset=gnomad_r3`}
            target="_blank"
          >
            {toExponentialNotation(gnomad_v3_af)}
          </AnchorLink>
        ) : (
          <EmptyField />
        )}
      </DescriptionRow>,
    );
  }

  // functional scores
  const functionalScores = [];

  // cadd phred
  if (cadd_phred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.cadd_phred')}>
        {cadd_phred.toExponential(2)}
      </DescriptionRow>,
    );
  }

  // cadd score
  if (cadd_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.cadd_raw')}>
        {cadd_score.toExponential(2)}
      </DescriptionRow>,
    );
  }

  // DANN score
  if (dann_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.dann')}>{dann_score}</DescriptionRow>,
    );
  }

  // LRT score
  if (lrt_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.lrt')}>
        {t(`common.filters.values.lrt_pred.${lrt_pred?.toLowerCase()}`) || lrt_pred}
        {lrt_score && ` (${lrt_score})`}
      </DescriptionRow>,
    );
  }

  // sift
  if (sift_pred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.sift')}>
        {t(`common.filters.values.sift_pred.${sift_pred?.toLowerCase()}`) || sift_pred}
        {sift_score && ` (${sift_score})`}
      </DescriptionRow>,
    );
  }

  // fathmm
  if (fathmm_pred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.fathmm')}>
        {t(`common.filters.values.fathmm_pred.${fathmm_pred?.toLowerCase()}`) || fathmm_pred}
        {fathmm_score && ` (${fathmm_score})`}
      </DescriptionRow>,
    );
  }

  // revel score
  if (revel_score) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.revel')}>{revel_score}</DescriptionRow>,
    );
  }

  // PolyPhen-2 HVAR
  if (polyphen2_hvar_pred) {
    functionalScores.push(
      <DescriptionRow label={t('occurrence_expand.functional_scores.polyphen2_hvar')}>
        {t(`common.filters.values.polyphen2_hvar_pred.${polyphen2_hvar_pred?.toLowerCase()}`) || polyphen2_hvar_pred}
        {polyphen2_hvar_score && ` (${polyphen2_hvar_score})`}
      </DescriptionRow>,
    );
  }

  // Classification
  const classification = [];

  // clinvar
  if ((clinvar ?? []).length) {
    classification.push(
      <DescriptionRow label={t('preview_sheet.variant_details.sections.classification.clinvar')}>
        <div className="flex gap-1">
          {(clinvar ?? []).map(key => (
            <ClassificationBadge key={key} value={key} abbreviated />
          ))}
        </div>
      </DescriptionRow>,
    );
  }

  // hotspot
  if (hotspot) {
    classification.push(
      <DescriptionRow label={t('preview_sheet.variant_details.sections.classification.hotspot')}>
        <div className="flex gap-1">
          <Flame
            className={cn({ 'text-indicator-red fill-indicator-red': hotspot, 'text-muted-foreground/40': !hotspot })}
            size={16}
          />
        </div>
      </DescriptionRow>,
    );
  }

  if (Object.keys(exomiser_acmg_classification_counts ?? {}).length) {
    classification.push(
      <DescriptionRow label={t('preview_sheet.variant_details.sections.classification.exomiser')}>
        {Object.entries(exomiser_acmg_classification_counts ?? {}).map(([key, count]) => (
          <ClassificationBadge key={key} value={key} count={count} abbreviated />
        ))}
      </DescriptionRow>,
    );
  }

  return (
    <div className="flex flex-wrap gap-4 rounded-md border border-border p-3 sm:gap-20 w-full">
      <div className="flex flex-1 flex-col gap-4">
        <DescriptionSection title={t('preview_sheet.variant_details.sections.interpretations.title')}>
          {Object.keys(interpretation_classification_counts ?? {}).length ? (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.interpretations.my_network')}>
              {Object.entries(interpretation_classification_counts ?? {}).map(([key, count]) => (
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
          {classification.length > 0 ? (
            classification.map(element => element)
          ) : (
            <span className="text-muted-foreground text-xs">
              {t('preview_sheet.variant_details.sections.classification.no_data')}
            </span>
          )}
        </DescriptionSection>
        <DescriptionSection title={t('preview_sheet.variant_details.sections.gene.title')}>
          <DescriptionRow label={t('occurrence_expand.gene.pli')}>
            {gnomad_pli ? (
              <AnchorLink
                href={`https://gnomad.broadinstitute.org/gene/${ensembl_gene_id}?dataset=gnomad_r2_1`}
                target="_blank"
                size="sm"
              >
                {toExponentialNotationAtThreshold(gnomad_pli)}
              </AnchorLink>
            ) : (
              <EmptyField />
            )}
          </DescriptionRow>
          <DescriptionRow label={t('occurrence_expand.gene.loeuf')}>
            {gnomad_loeuf ? (
              <AnchorLink
                href={`https://gnomad.broadinstitute.org/gene/${ensembl_gene_id}?dataset=gnomad_r2_1`}
                target="_blank"
                size="sm"
              >
                {toExponentialNotationAtThreshold(gnomad_loeuf)}
              </AnchorLink>
            ) : (
              <EmptyField />
            )}
          </DescriptionRow>
          <DescriptionRow label={t('occurrence_expand.gene.splice_ai')}>
            {spliceai_type ? (
              <div className="flex gap-1">
                <AnchorLink
                  href={`https://spliceailookup.broadinstitute.org/#variant=${hgvsg}&hg=38`}
                  target="_blank"
                  size="sm"
                >
                  {spliceai_ds}
                </AnchorLink>

                {spliceai_type.map(v => (
                  <Badge key={v}>{v}</Badge>
                ))}
              </div>
            ) : (
              <EmptyField />
            )}
          </DescriptionRow>
        </DescriptionSection>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <DescriptionSection title={t('preview_sheet.variant_details.sections.frequencies.title')}>
          {frequencies.map(element => element)}
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

type GeneCardProps = {
  symbol?: string;
  aa_change?: string;
  ensembl_gene_id?: string;
  vep_impact?: VepImpact;
  picked_consequences?: string[];
  dna_change?: string;
  transcript_id?: string;
  is_mane_select?: boolean;
  is_canonical?: boolean;
  exon_rank?: number;
  exon_total?: number;
  rsnumber?: string;
};
const GeneCard = ({
  symbol,
  aa_change,
  ensembl_gene_id,
  vep_impact,
  picked_consequences,
  dna_change,
  transcript_id,
  is_mane_select,
  is_canonical,
  exon_rank,
  exon_total,
  rsnumber,
}: GeneCardProps) => {
  const { t } = useI18n();
  const pickedConsequence = picked_consequences?.[0];
  const hasGene = !!symbol;

  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex flex-wrap gap-4 sm:gap-20 w-full">
        {hasGene && (
          <div className="flex flex-1 flex-col grow gap-2">
            <AnchorLink className="font-semibold text-lg" external href={getOmimOrgUrl({ symbol: symbol! })}>
              {symbol}
            </AnchorLink>
            {aa_change && <div className="font-mono font-semibold text-sm">{aa_change}</div>}
            {ensembl_gene_id && (
              <AnchorLink target="_blank" className="text-sm" external href={getEnsemblUrl(ensembl_gene_id)}>
                {t('preview_sheet.variant_details.actions.ensembl')}
              </AnchorLink>
            )}
          </div>
        )}
        <div className={cn('flex flex-col gap-2', { 'flex-1 grow': hasGene })}>
          {vep_impact && pickedConsequence && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.consequence')}>
              <ConsequenceIndicator vepImpact={vep_impact} consequence={pickedConsequence} size="sm" />
            </DescriptionRow>
          )}
          {dna_change && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.cdna_change')}>
              <div className="font-mono">{dna_change}</div>
            </DescriptionRow>
          )}
          {transcript_id && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.transcript_id')}>
              <TranscriptIdLink
                transcriptId={transcript_id}
                isManeSelect={is_mane_select}
                isManePlus={false}
                isCanonical={is_canonical}
                linkClassName="text-primary"
              />
            </DescriptionRow>
          )}
          {exon_rank && exon_total && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.exon')}>
              <div className="font-mono">
                {exon_rank}/{exon_total}
              </div>
            </DescriptionRow>
          )}
          {rsnumber && (
            <DescriptionRow label={t('preview_sheet.variant_details.sections.gene_card.dbsnp_id')}>
              <AnchorLink href={getDbSnpUrl(rsnumber)} mono size="sm" target="_blank" rel="noreferrer">
                {rsnumber}
              </AnchorLink>
            </DescriptionRow>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderVariantDetailsCard;
