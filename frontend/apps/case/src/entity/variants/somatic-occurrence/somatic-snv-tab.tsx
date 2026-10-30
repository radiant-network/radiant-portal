import { useMemo } from 'react';

import type { CaseEntity, CaseSequencingExperiment, SortBody } from '@/api/api';
import type { ICountInput, IListInput } from '@/components/base/query-builder/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { getPatientClinicalInformation } from '@/components/lib/case-entity';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useTaskIdFromSearchParam } from '@/utils/helper';

import { useCanDownloadVariantsReport } from '../../../permissions/use-case-permissions';
import { type SomaticSNVCohort, SomaticVariantInterface } from '../constants';
import AnnotationsTableQuickfilters from '../filters/annotations-table-quickfilters';
import { isValidSeqId } from '../germline-occurrence/libs/seq-id';
import VariantsOnboardingWizard from '../onboardings/variants-onboarding-wizard';
import VariantsReportButton from '../table/variants-report-button';

import SliderSomaticOccurrenceSheet from './sliders/slider-somatic-occurrence-sheet';
import { defaultSomaticSNVSettings, getSomaticSNVColumns } from './table/somatic-snv-table-settings';

const SOMATIC_SNV_DEFAULT_SORTING: SortBody[] = [{ field: 'max_impact_score', order: 'desc' }];

type SomaticOccurrencesProps = {
  /**
   * Cohort whose occurrences to list. Both cohorts share these endpoints — the task selected in the
   * URL is what scopes the results to tumor-only or tumor-normal calls — but each keeps its own app
   * config, hence its own facets, column settings and query builder state.
   */
  cohort: SomaticSNVCohort;
  seqId: number;
  patientSelected?: CaseSequencingExperiment;
  caseEntity?: CaseEntity;
};

function SomaticSNVTab({ cohort, seqId, patientSelected, caseEntity }: SomaticOccurrencesProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const config = useConfig();
  const caseId = useCaseIdFromParam();
  const appId =
    cohort === SomaticVariantInterface.SNV_TO
      ? config.somatic_snv_to_occurrence.app_id
      : config.somatic_snv_tn_occurrence.app_id;
  const patient = getPatientClinicalInformation(caseEntity, patientSelected);
  const taskId = useTaskIdFromSearchParam();
  const canDownloadVariantsReport = useCanDownloadVariantsReport();

  const columns = useMemo(
    () =>
      getSomaticSNVColumns({
        t,
        caseEntity,
        patientId: patient?.patient_id,
        canDownloadReport: canDownloadVariantsReport,
      }),
    [t, caseEntity, patient?.patient_id, canDownloadVariantsReport],
  );

  if (!isValidSeqId(seqId)) {
    return null;
  }

  return (
    <>
      {/*
       * Keyed on the app so switching cohorts remounts the whole query builder. Both cohorts render
       * this same component, so React would otherwise keep the instance alive and the query builder
       * state — held in a reducer initialised once from the user preference — would leak across.
       */}
      <QueryBuilder
        key={appId}
        appId={appId}
        fetcher={{
          list: async (params: IListInput) => {
            if (taskId === undefined) return [];
            return occurrencesApi
              .listSomaticSNVOccurrences(tenant, caseId, seqId, taskId, params.listBody)
              .then(response => response.data);
          },
          count: async (params: ICountInput) => {
            if (taskId === undefined) return { count: 0 };
            return occurrencesApi
              .countSomaticSNVOccurrences(tenant, caseId, seqId, taskId, params.countBody)
              .then(response => response.data);
          },
        }}
      >
        <QueryBuilderDataTable
          id={appId}
          swrId={`${seqId}-${taskId}`}
          columns={columns}
          defaultColumnSettings={defaultSomaticSNVSettings}
          defaultSorting={SOMATIC_SNV_DEFAULT_SORTING}
          enableColumnOrdering
          enableFullscreen
          extras={[<SliderSomaticOccurrenceSheet key={`${appId}-sheet`} patientSelected={patientSelected} />]}
          TableFilters={<AnnotationsTableQuickfilters />}
          selection={
            canDownloadVariantsReport
              ? {
                  idField: 'locus_id',
                  renderActions: selection => (
                    <VariantsReportButton kind="somatic" seqId={seqId} taskId={taskId} selection={selection} />
                  ),
                }
              : undefined
          }
        />
      </QueryBuilder>
      <VariantsOnboardingWizard />
    </>
  );
}
export default SomaticSNVTab;
