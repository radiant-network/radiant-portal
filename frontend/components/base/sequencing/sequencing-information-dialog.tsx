import { useCallback, useEffect } from 'react';
import { formatDate } from 'date-fns';
import useSWR from 'swr';

import { Assay } from '@/api/api';
import { AssayStatus } from '@/components/base/badges/assay-status-badge';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import InformationField from '@/components/base/information/information-field';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { Separator } from '@/components/base/shadcn/separator';
import { useI18n } from '@/components/hooks/i18n';
import { assayApi } from '@/utils/api';

type AssayInput = {
  seqId: string;
};

export function useSequencingHelper(input: AssayInput) {
  const fetchSequencingHelper = useCallback(
    async () => assayApi.getAssayBySeqId(input.seqId).then(response => response.data),
    [input],
  );

  return fetchSequencingHelper;
}

type SequencingInformationsDialogProps = {
  seqId: string;
  open: boolean;
  onClose: (value: boolean) => void;
};

function SequencingInformationsDialog({ open, seqId, onClose }: SequencingInformationsDialogProps) {
  const { t } = useI18n();

  const fetchSequencing = useSWR<Assay>('fetch-assay', useSequencingHelper({ seqId }), {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  const { data } = fetchSequencing;

  useEffect(() => {
    if (open) {
      fetchSequencing.mutate();
    }
  }, [open, seqId]);

  return (
    <Dialog open={open} onOpenChange={(value: boolean) => onClose(value)}>
      <DialogContent className="md:min-w-[800px] lg:min-w-[1050px]">
        <DialogHeader>
          <DialogTitle>{t('case_entity.details.sequencing_details_dialog')}</DialogTitle>
        </DialogHeader>

        {/* Status */}
        <DialogBody className="flex flex-col w-full md:justify-between md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">
              {t('case_entity.details.sequencing')} {data?.seq_id}
            </h2>

            <InformationField label={t('case_entity.details.status')}>
              <AssayStatusCell status={data?.status_code as AssayStatus} />
            </InformationField>

            {/* Created On */}
            <InformationField
              label={t('case_entity.details.created_on_male')}
              tooltipText={t('case_entity.details.date_format_tooltip')}
            >
              {data?.created_on && <>{formatDate(data.created_on, t('common.date'))}</>}
            </InformationField>

            {/* Last Update */}
            <InformationField
              label={t('case_entity.details.last_update')}
              tooltipText={t('case_entity.details.date_format_tooltip')}
            >
              {data?.updated_on && <>{formatDate(data.updated_on, t('common.date'))}</>}
            </InformationField>

            {/* Diag. Lab. */}
            <InformationField
              label={t('case_entity.details.diag_lab')}
              labelTooltipText={t('case_entity.details.diag_lab_tooltip')}
              tooltipText={data?.sequencing_lab_name}
            >
              {data?.sequencing_lab_code}
            </InformationField>

            {/* Aliquot */}
            <InformationField label={t('case_entity.details.aliquot')}>{data?.aliquot}</InformationField>

            {/* Run Name */}
            <InformationField label={t('case_entity.details.run_name')}>{data?.run_name}</InformationField>

            {/* Run Alias */}
            <InformationField label={t('case_entity.details.run_alias')}>{data?.run_alias}</InformationField>

            {/* Run Date */}
            <InformationField
              label={t('case_entity.details.run_date')}
              tooltipText={t('case_entity.details.date_format_tooltip')}
            >
              {data?.run_date && <>{formatDate(data.run_date, t('common.date'))}</>}
            </InformationField>
          </div>
          <Separator orientation="vertical" className="hidden mx-8 md:block" />
          <Separator className="block my-8 md:hidden" />
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">{t('case_entity.details.experiment')}</h2>

            {/* Exp. Strategy */}
            <InformationField
              label={t('case_entity.details.experimental_strategy_code')}
              tooltipText={data?.experimental_strategy_name}
            >
              {data?.experimental_strategy_code && (
                <Badge className="uppercase" variant="secondary">
                  {data?.experimental_strategy_code}
                </Badge>
              )}
            </InformationField>

            {/* Read technology */}
            <InformationField label={t('case_entity.details.read_technology')}>
              {data?.sequencing_read_technology_name}
            </InformationField>

            {/* Platform */}
            <InformationField label={t('case_entity.details.platform')}>{data?.platform_code}</InformationField>

            {/* Capture Kit */}
            <InformationField label={t('case_entity.details.capture_kit')}>{data?.capture_kit}</InformationField>
          </div>
          <Separator orientation="vertical" className="hidden mx-8 md:block" />
          <Separator className="block my-8 md:hidden" />
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">
              {t('case_entity.details.sample')} {data?.sample_id ?? '-'}
            </h2>

            {/* Type */}
            <InformationField label={t('case_entity.details.type')}>{data?.sample_type_code}</InformationField>

            {/* Tissue site */}
            <InformationField label={t('case_entity.details.tissue_site')}>{data?.tissue_site}</InformationField>

            {/* Histology */}
            <InformationField label={t('case_entity.details.histology_code')}>{data?.histology_code}</InformationField>

            {/* Submitter ID */}
            <InformationField label={t('case_entity.details.submitter_id')}>
              {data?.submitter_sample_id}
            </InformationField>

            {/* Patient ID */}
            <InformationField label={t('case_entity.details.patient_id')}>{data?.patient_id}</InformationField>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => onClose(true)}>{t('common.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SequencingInformationsDialog;
