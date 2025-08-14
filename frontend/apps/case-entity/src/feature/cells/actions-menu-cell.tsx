import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CellContext } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { EllipsisVertical, ExternalLink } from 'lucide-react';
import useSWR from 'swr';

import { Assay } from '@/api/api';
import { AssayStatus } from '@/components/base/badges/assay-status-badge';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import InformationField from '@/components/base/information/information-field';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/base/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import { CaseEntityTabs } from '@/types';
import { assayApi } from '@/utils/api';

type AssayInput = {
  seqId: string;
};

export function useAssayHelper(input: AssayInput) {
  const fetchAssayHelper = useCallback(
    async () => assayApi.getAssayBySeqId(input.seqId).then(response => response.data),
    [input],
  );

  return fetchAssayHelper;
}

type AssayInformationsDialogProps = {
  seqId: string;
  open: boolean;
  onClose: (value: boolean) => void;
};
function AssayInformationsDialog({ open, seqId, onClose }: AssayInformationsDialogProps) {
  const { t } = useI18n();

  const fetchAssay = useSWR<Assay>('fetch-assay', useAssayHelper({ seqId }), {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  const { data } = fetchAssay;

  useEffect(() => {
    if (open) {
      fetchAssay.mutate();
    }
  }, [open, seqId]);

  return (
    <Dialog open={open} onOpenChange={(value: boolean) => onClose(value)}>
      <DialogContent className="md:min-w-[800px] lg:min-w-[1050px]">
        <DialogHeader>
          <DialogTitle>{t('case_entity.details.assay_details_dialog')}</DialogTitle>
        </DialogHeader>

        {/* Status */}
        <div className="flex flex-col w-full md:justify-between md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">
              {t('case_entity.details.assay')} {data?.seq_id}
            </h2>

            <InformationField label={t('case_entity.details.status')}>
              <AssayStatusCell status={data?.status_code as AssayStatus} />
            </InformationField>

            {/* Created On */}
            <InformationField
              label={t('case_entity.details.created_on')}
              tooltipsText={t('case_entity.details.date_format_tooltip')}
            >
              {data?.created_on && <>{formatDate(data.created_on, t('common.date'))}</>}
            </InformationField>

            {/* Last Update */}
            <InformationField
              label={t('case_entity.details.last_update')}
              tooltipsText={t('case_entity.details.date_format_tooltip')}
            >
              {data?.updated_on && <>{formatDate(data.updated_on, t('common.date'))}</>}
            </InformationField>

            {/* Diag. Lab. */}
            <InformationField label={t('case_entity.details.diag_lab')} tooltipsText={data?.performer_lab_name}>
              {data?.performer_lab_code}
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
              tooltipsText={t('case_entity.details.date_format_tooltip')}
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
              tooltipsText={data?.experimental_strategy_name}
            >
              {data?.experimental_strategy_code && (
                <Badge variant="secondary">{data?.experimental_strategy_code}</Badge>
              )}
            </InformationField>

            {/* Paired End */}
            <InformationField label={t('case_entity.details.paired_end')}>
              <Badge variant="outline">{t(`case_entity.details.paired_end_${data?.is_paired_end ?? 'false'}`)}</Badge>
            </InformationField>

            {/* Platform */}
            <InformationField label={t('case_entity.details.platform')}>{data?.platform_code}</InformationField>

            {/* Capture Kit */}
            <InformationField label={t('case_entity.details.capture_kit')}>{data?.capture_kit}</InformationField>

            {/* Read Lenght */}
            <InformationField label={t('case_entity.details.read_length')}>
              {data?.read_length?.toString()}
            </InformationField>

            {/* Description */}
            <InformationField label={t('case_entity.details.description')}>
              {data?.experiment_description}
            </InformationField>
          </div>
          <Separator orientation="vertical" className="hidden mx-8 md:block" />
          <Separator className="block my-8 md:hidden" />
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">
              {t('case_entity.details.sample')} {data?.sample_id ?? '-'}
            </h2>

            {/* Category */}
            <InformationField label={t('case_entity.details.category')}>{data?.category_code}</InformationField>

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
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onClose(true)}>{t('common.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ActionsMenuCell({ row }: CellContext<any, any>) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [assayDialogOpen, setAssayDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <AssayInformationsDialog
          open={assayDialogOpen}
          onClose={() => setAssayDialogOpen(false)}
          seqId={row.original.seq_id}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button iconOnly variant="outline" onClick={row.getToggleExpandedHandler()} className="size-6">
              {<EllipsisVertical />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              disabled={!row.original.has_variants}
              onClick={() => {
                searchParams.set('tab', CaseEntityTabs.Variants);
                searchParams.set('seq_id', row.original.seq_id);
                setSearchParams(searchParams, { replace: true });
              }}
            >
              <ExternalLink />
              {t('case_exploration.case.actions.view_variant')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setAssayDialogOpen(true);
              }}
            >
              <ExternalLink />
              {t('case_exploration.case.actions.view_assay')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default ActionsMenuCell;
