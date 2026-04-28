import { SquarePen } from 'lucide-react';

import { CaseSequencingExperiment, GermlineSNVOccurrence } from '@/api/api';
import { NotesProvider } from '@/components/base/notes/hooks/use-notes';
import NotesSliderSheet from '@/components/base/notes/notes-slider-sheet';
import { useOccurrenceListContext } from '@/components/base/occurrence/hooks/use-occurrences-list';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import GermlineSliderInterpretationDetailsCard from '@/components/base/slider/germline-slider-interpretation-details-card';
import { useGermlineOccurrenceAndCase } from '@/components/base/slider/hooks/use-slider-occurrence-and-case';
import SliderHeader from '@/components/base/slider/slider-header';
import SliderOccurrenceDetailsCard from '@/components/base/slider/slider-occurrence-details-card';
import SliderOccurrenceSubHeader from '@/components/base/slider/slider-occurrence-sub-header';
import SliderPatientRow from '@/components/base/slider/slider-patient-row';
import SliderSheet from '@/components/base/slider/slider-sheet';
import SliderSheetSkeleton from '@/components/base/slider/slider-sheet-skeleton';
import SliderVariantDetailsCard from '@/components/base/slider/slider-variant-details-card';
import { useI18n } from '@/components/hooks/i18n';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import GermlineInterpretationDialog from '../interpretation/germline-interpretation-form';

type GermlineOccurrenceSliderSheetProps = {
  occurrence?: GermlineSNVOccurrence;
  children?: React.ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  patientSelected?: CaseSequencingExperiment;
  onInterpretationSaved: () => void;
};

function SliderGermlineOccurrenceSheet({
  occurrence,
  children,
  open,
  setOpen,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  patientSelected,
  onInterpretationSaved,
}: GermlineOccurrenceSliderSheetProps) {
  return (
    <SliderSheet trigger={children} open={open} setOpen={setOpen}>
      {occurrence && (
        <GermlineOccurrenceSheetContent
          onInterpretationSaved={onInterpretationSaved}
          occurrence={occurrence}
          onPrevious={onPrevious}
          onNext={onNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          patientSelected={patientSelected}
        />
      )}
    </SliderSheet>
  );
}

type OccurrenceSheetContentProps = {
  occurrence: GermlineSNVOccurrence;
  onInterpretationSaved: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  patientSelected?: CaseSequencingExperiment;
};

function GermlineOccurrenceSheetContent({
  occurrence,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  patientSelected,
  onInterpretationSaved,
}: OccurrenceSheetContentProps) {
  const { t } = useI18n();
  const caseId = useCaseIdFromParam();
  // seqId is to fetch the occurrence
  const seqId = useSeqIdFromSearchParam();

  // @TODO: To remove when using query-buidler v3, see somatic slider for reference
  const { mutate: listFetcher } = useOccurrenceListContext();
  const { patient, caseResult, caseSequencing, expandResult, isLoading } = useGermlineOccurrenceAndCase(
    caseId,
    seqId,
    occurrence.locus_id.toString(),
    patientSelected,
  );

  if (isLoading || !expandResult.data) {
    return <SliderSheetSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SliderHeader onPrevious={onPrevious} onNext={onNext} hasPrevious={hasPrevious} hasNext={hasNext}>
        <SliderPatientRow
          patientId={patient?.patient_id}
          relationshipToProband={patient?.relationship_to_proband}
          seqId={caseSequencing?.seq_id}
        />
      </SliderHeader>
      <Separator />
      <SliderOccurrenceSubHeader
        type={caseResult.data?.case_type}
        locusId={occurrence.locus_id}
        hgvsg={occurrence.hgvsg}
        actions={
          <div className="flex gap-2">
            <NotesProvider value={{ onChangeCallback: listFetcher }}>
              <NotesSliderSheet
                caseId={caseId}
                seqId={occurrence.seq_id}
                taskId={occurrence.task_id}
                occurenceId={occurrence.locus_id}
              />
            </NotesProvider>
            {!occurrence.has_interpretation && (
              <GermlineInterpretationDialog
                isCreation
                locusId={occurrence.locus_id}
                transcriptId={occurrence.transcript_id}
                handleSaveCallback={onInterpretationSaved}
                renderTrigger={handleOpen => (
                  <Button size="sm" onClick={handleOpen}>
                    <SquarePen />
                    {t('preview_sheet.actions.interpretation')}
                  </Button>
                )}
              />
            )}
          </div>
        }
      />
      {occurrence.has_interpretation && (
        <GermlineSliderInterpretationDetailsCard
          seqId={seqId}
          caseId={caseId}
          symbol={occurrence?.symbol}
          locusId={occurrence?.locus_id}
          isManeSelect={occurrence?.is_mane_select}
          isManePlus={occurrence?.is_mane_plus}
          isCanonical={occurrence?.is_canonical}
          transcriptId={occurrence?.transcript_id}
          actions={
            <GermlineInterpretationDialog
              locusId={occurrence.locus_id}
              transcriptId={expandResult.data.transcript_id}
              handleSaveCallback={onInterpretationSaved}
              renderTrigger={handleOpen => (
                <Button size="sm" onClick={handleOpen}>
                  <SquarePen />
                  {t('common.edit')}
                </Button>
              )}
            />
          }
        />
      )}
      {caseId && (
        <SliderOccurrenceDetailsCard
          caseId={caseId}
          seqId={occurrence.seq_id}
          locus={occurrence.locus}
          start={occurrence.start}
          quality_depth={expandResult.data.qd}
          chromosome={occurrence.chromosome}
          zygosity={expandResult.data.zygosity}
          transmission={expandResult.data.transmission}
          parental_origin={expandResult.data.parental_origin}
          genotype_quality={expandResult.data.genotype_quality}
          relationshipToProband={patient?.relationship_to_proband}
          filter={expandResult.data.filter}
          father_calls={expandResult.data.father_calls}
          mother_calls={expandResult.data.mother_calls}
          ad_alt={expandResult.data.ad_alt}
          ad_total={expandResult.data.ad_total}
          has_igv_files={caseResult.data?.has_igv_files}
        />
      )}
      <SliderVariantDetailsCard
        type="germline"
        chromosome={expandResult.data.chromosome}
        start={expandResult.data.start}
        end={expandResult.data.end}
        omim_conditions={expandResult.data.omim_conditions}
        locus_id={occurrence.locus_id}
        germline_pc_wgs_affected={expandResult.data.germline_pc_wgs_affected}
        germline_pn_wgs_affected={expandResult.data.germline_pn_wgs_affected}
        germline_pf_wgs_affected={expandResult.data.germline_pf_wgs_affected}
        germline_pc_wgs_not_affected={expandResult.data.germline_pc_wgs_not_affected}
        germline_pn_wgs_not_affected={expandResult.data.germline_pn_wgs_not_affected}
        germline_pf_wgs_not_affected={expandResult.data.germline_pf_wgs_not_affected}
        cadd_phred={expandResult.data.cadd_phred}
        cadd_score={expandResult.data.cadd_score}
        dann_score={expandResult.data.dann_score}
        lrt_pred={expandResult.data.lrt_pred}
        lrt_score={expandResult.data.lrt_score}
        sift_pred={expandResult.data.sift_pred}
        sift_score={expandResult.data.sift_score}
        fathmm_pred={expandResult.data.fathmm_pred}
        fathmm_score={expandResult.data.fathmm_score}
        polyphen2_hvar_pred={expandResult.data.polyphen2_hvar_pred}
        polyphen2_hvar_score={expandResult.data.polyphen2_hvar_score}
        clinvar={expandResult.data.clinvar}
        exomiser_acmg_classification_counts={expandResult.data.exomiser_acmg_classification_counts}
        interpretation_classification_counts={expandResult.data.interpretation_classification_counts}
        gnomad_pli={expandResult.data.gnomad_pli}
        gnomad_loeuf={expandResult.data.gnomad_loeuf}
        ensembl_gene_id={expandResult.data.ensembl_gene_id}
        spliceai_type={expandResult.data.spliceai_type}
        spliceai_ds={expandResult.data.spliceai_ds}
        hgvsg={expandResult.data.hgvsg}
        gnomad_v3_af={expandResult.data.gnomad_v3_af}
        locus={expandResult.data.locus}
        symbol={expandResult.data.symbol}
        aa_change={expandResult.data.aa_change}
        vep_impact={expandResult.data.vep_impact}
        picked_consequences={expandResult.data.picked_consequences}
        dna_change={expandResult.data.dna_change}
        transcript_id={expandResult.data.transcript_id}
        is_mane_select={expandResult.data.is_mane_select}
        is_canonical={expandResult.data.is_canonical}
        exon_rank={expandResult.data.exon_rank}
        exon_total={expandResult.data.exon_total}
        rsnumber={expandResult.data.rsnumber}
      />
    </div>
  );
}

export default SliderGermlineOccurrenceSheet;
