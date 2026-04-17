import { useState } from 'react';

import { CaseSequencingExperiment } from '@/api/api';
import { ICountInput, IListInput } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder-v3/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

import { isValidSeqId } from '../germline-occurrence/libs/seq-id';

import SliderSomaticOccurrenceSheet from './sliders/slider-somatic-occurrence-sheet';
import {
  defaultSomaticSNVSettings,
  getSomaticSNVOccurrenceColumns,
} from './table/somatic-snv-to-occurrence-table-settings';

type SomaticOccurrencesProps = {
  seqId: number;
  patientSelected?: CaseSequencingExperiment;
};

function SNVToTab({ seqId, patientSelected }: SomaticOccurrencesProps) {
  const { t } = useI18n();
  const config = useConfig();
  const caseId = useCaseIdFromParam();
  const appId = config.somatic_snv_to_occurrence.app_id;

  if (!isValidSeqId(seqId)) {
    return null;
  }

  return (
    <QueryBuilder
      appId={appId}
      fetcher={{
        list: async (params: IListInput) =>
          occurrencesApi.listSomaticSNVOccurrences(caseId, seqId, params.listBody).then(response => response.data),
        count: async (params: ICountInput) =>
          occurrencesApi.countSomaticSNVOccurrences(caseId, seqId, params.countBody).then(response => response.data),
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        columns={getSomaticSNVOccurrenceColumns(t)}
        defaultColumnSettings={defaultSomaticSNVSettings}
        enableColumnOrdering
        enableFullscreen
        extras={[
          <SliderSomaticOccurrenceSheet key="somatic-snv-to-occurrence-sheet" patientSelected={patientSelected} />,
        ]}
      />
    </QueryBuilder>
  );
}
export default SNVToTab;
