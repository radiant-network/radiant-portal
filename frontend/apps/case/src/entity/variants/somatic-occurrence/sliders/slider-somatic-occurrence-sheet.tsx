import { useCallback } from 'react';
import { SquarePen } from 'lucide-react';

import { CaseSequencingExperiment, SomaticSNVOccurrence } from '@/api/api';
import { useDataTable, useDataTableRowNavigation } from '@/components/base/data-table/hooks/use-data-table';
import InterpretationDialog from '@/components/base/interpretation/interpretation-dialog';
import { NotesProvider } from '@/components/base/notes/hooks/use-notes';
import NotesSliderSheet from '@/components/base/notes/notes-slider-sheet';
import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';
import { useSomaticOccurrenceAndCase } from '@/components/base/slider/hooks/use-slider-occurrence-and-case';
import SliderHeader from '@/components/base/slider/slider-header';
import SliderInterpretationDetailsCard from '@/components/base/slider/slider-interpretation-details-card';
import SliderOccurrenceDetailsCard from '@/components/base/slider/slider-occurrence-details-card';
import SliderOccurrenceSubHeader from '@/components/base/slider/slider-occurrence-sub-header';
import SliderPatientRow from '@/components/base/slider/slider-patient-row';
import SliderSheet from '@/components/base/slider/slider-sheet';
import SliderSheetSkeleton from '@/components/base/slider/slider-sheet-skeleton';
import SliderVariantDetailsCard from '@/components/base/slider/slider-variant-details-card';
import { useI18n } from '@/components/hooks/i18n';
import { useCaseIdFromParam } from '@/utils/helper';

import { SELECTED_VARIANT_PARAM } from '../../constants';

type SomaticOccurrenceSheetProps = {
  children?: React.ReactElement;
  patientSelected?: CaseSequencingExperiment;
};

function SomaticOccurrenceSheet({ patientSelected, children }: SomaticOccurrenceSheetProps) {
  const { list } = useDataTable();

  const rowNavigation = useDataTableRowNavigation<SomaticSNVOccurrence>({
    data: list?.data ?? [],
    paramsKey: SELECTED_VARIANT_PARAM,
    targetKey: 'locus_id',
    find: target => (value: SomaticSNVOccurrence) => value.locus_id === target,
  });

  return (
    <SliderSheet trigger={children} open={!!rowNavigation.selected} setOpen={rowNavigation.handleClose}>
      {rowNavigation.selected && (
        <SomaticOccurrenceSheetContent
          occurrence={rowNavigation.selected}
          onPrevious={rowNavigation.handlePrevious}
          onNext={rowNavigation.handleNext}
          hasPrevious={rowNavigation.hasPrevious}
          hasNext={rowNavigation.hasNext}
          patientSelected={patientSelected}
        />
      )}
    </SliderSheet>
  );
}

type SomaticOccurrenceSheetContentProps = {
  occurrence: SomaticSNVOccurrence;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  patientSelected?: CaseSequencingExperiment;
};

export function SomaticOccurrenceSheetContent({
  occurrence,
  patientSelected,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: SomaticOccurrenceSheetContentProps) {
  const { t } = useI18n();
  const caseId = useCaseIdFromParam();

  const { list } = useDataTable();

  const { patient, caseResult, caseSequencing, expandResult, isLoading } = useSomaticOccurrenceAndCase(
    caseId,
    occurrence.seq_id,
    occurrence.locus_id.toString(),
    patientSelected,
  );

  const listFetcher = useCallback(() => {
    if (list) {
      list.mutate();
    }
  }, [list]);

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
              <InterpretationDialog
                locusId={occurrence.locus_id}
                handleSaveCallback={listFetcher}
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
        <SliderInterpretationDetailsCard
          canEditInterpretation
          onInterpretationSaved={listFetcher}
          seqId={occurrence.seq_id}
          caseId={caseId}
          symbol={occurrence?.symbol}
          locusId={occurrence?.locus_id}
          isManeSelect={occurrence?.is_mane_select}
          isManePlus={occurrence?.is_mane_plus}
          isCanonical={occurrence?.is_canonical}
        />
      )}

      {caseId && (
        <SliderOccurrenceDetailsCard
          caseId={caseId}
          seqId={occurrence.seq_id}
          quality_depth={expandResult.data.qd}
          relationshipToProband={patient?.relationship_to_proband}
          filter={expandResult.data.filter}
          ad_alt={expandResult.data.ad_alt}
          ad_total={expandResult.data.ad_total}
          locus={expandResult.data.locus}
          enableIGV
        />
      )}
      <SliderVariantDetailsCard
        type="somatic"
        omim_conditions={expandResult.data.omim_conditions}
        locus_id={occurrence.locus_id}
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
        hotspot={occurrence.hotspot}
        somatic_pc_tn_wgs={expandResult.data.somatic_pc_tn_wgs}
        somatic_pn_tn_wgs={expandResult.data.somatic_pn_tn_wgs}
        somatic_pf_tn_wgs={expandResult.data.somatic_pf_tn_wgs}
      />
    </div>
  );
}
export default SomaticOccurrenceSheet;
