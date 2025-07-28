import { Button } from '@/components/base/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/base/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import { useSearchParams } from 'react-router-dom';
import InformationField from '@/components/base/information/information-field';
import { useI18n } from '@/components/hooks/i18n';
import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, ExternalLink } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Separator } from '@/components/base/ui/separator';
import AssayStatusCell, { AssayStatus } from '@/components/base/data-table/cells/assay-status-cell';
import { assayApi } from '@/utils/api';
import useSWR from 'swr';
import { Assay } from '@/api/api';
import { formatDate } from 'date-fns';
import { Badge } from '@/components/base/ui/badge';
import { CaseEntityTabs } from '@/types';

type AssayInput = {
  seqId: string;
};

export function useAssayHelper(input: AssayInput) {
  const fetchAssayHelper = useCallback(async () => {
    return assayApi.getAssayBySeqId(input.seqId).then(response => response.data);
  }, [input]);

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
          <DialogTitle>{t('caseEntity.details.assayDetailsDialog')}</DialogTitle>
        </DialogHeader>

        {/* Status */}
        <div className="flex flex-col w-full md:justify-between md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">
              {t('caseEntity.details.assay')} {data?.seq_id}
            </h2>

            <InformationField label={t('caseEntity.details.status')}>
              <AssayStatusCell status={data?.status_code as AssayStatus} />
            </InformationField>

            {/* Created On */}
            <InformationField
              label={t('caseEntity.details.createdOn')}
              tooltipsText={t('caseEntity.details.date_format_tooltips')}
            >
              {data?.created_on && <>{formatDate(data.created_on, t('common.date'))}</>}
            </InformationField>

            {/* Last Update */}
            <InformationField
              label={t('caseEntity.details.lastUpdate')}
              tooltipsText={t('caseEntity.details.date_format_tooltips')}
            >
              {data?.updated_on && <>{formatDate(data.updated_on, t('common.date'))}</>}
            </InformationField>

            {/* Diag. Lab. */}
            <InformationField label={t('caseEntity.details.diagLab')} tooltipsText={data?.performer_lab_name}>
              {data?.performer_lab_code}
            </InformationField>

            {/* Aliquot */}
            <InformationField label={t('caseEntity.details.aliquot')}>{data?.aliquot}</InformationField>

            {/* Run Name */}
            <InformationField label={t('caseEntity.details.run_name')}>{data?.run_name}</InformationField>

            {/* Run Alias */}
            <InformationField label={t('caseEntity.details.run_alias')}>{data?.run_alias}</InformationField>

            {/* Run Date */}
            <InformationField
              label={t('caseEntity.details.run_date')}
              tooltipsText={t('caseEntity.details.date_format_tooltips')}
            >
              {data?.run_date && <>{formatDate(data.run_date, t('common.date'))}</>}
            </InformationField>
          </div>
          <Separator orientation="vertical" className="hidden mx-8 md:block" />
          <Separator className="block my-8 md:hidden" />
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">{t('caseEntity.details.experiment')}</h2>

            {/* Exp. Strategy */}
            <InformationField
              label={t('caseEntity.details.experimental_strategy_code')}
              tooltipsText={data?.experimental_strategy_name}
            >
              {data?.experimental_strategy_code && (
                <Badge variant="secondary">{data?.experimental_strategy_code}</Badge>
              )}
            </InformationField>

            {/* Paired End */}
            <InformationField label={t('caseEntity.details.paired_end')}>
              <Badge variant="outline">{t(`caseEntity.details.paired_end_${data?.is_paired_end ?? 'false'}`)}</Badge>
            </InformationField>

            {/* Platform */}
            <InformationField label={t('caseEntity.details.platform')}>{data?.platform_code}</InformationField>

            {/* Capture Kit */}
            <InformationField label={t('caseEntity.details.capture_kit')}>{data?.capture_kit}</InformationField>

            {/* Read Lenght */}
            <InformationField label={t('caseEntity.details.read_length')}>
              {data?.read_length?.toString()}
            </InformationField>

            {/* Description */}
            <InformationField label={t('caseEntity.details.description')}>
              {data?.experiment_description}
            </InformationField>
          </div>
          <Separator orientation="vertical" className="hidden mx-8 md:block" />
          <Separator className="block my-8 md:hidden" />
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold">
              {t('caseEntity.details.sample')} {data?.sample_id ?? '-'}
            </h2>

            {/* Category */}
            <InformationField label={t('caseEntity.details.category')}>{data?.category_code}</InformationField>

            {/* Type */}
            <InformationField label={t('caseEntity.details.type')}>{data?.sample_type_code}</InformationField>

            {/* Tissue site */}
            <InformationField label={t('caseEntity.details.tissue_site')}>{data?.tissue_site}</InformationField>

            {/* Histology */}
            <InformationField label={t('caseEntity.details.histology_code')}>{data?.histology_code}</InformationField>

            {/* Submitter ID */}
            <InformationField label={t('caseEntity.details.submitter_id')}>
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
                searchParams.set("tab", CaseEntityTabs.Variants);
                searchParams.set("seq_id", row.original.seq_id);
                setSearchParams(searchParams, { replace: true });
              }}>
              <ExternalLink />
              {t('caseExploration.case.actions.view_variant')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setAssayDialogOpen(true);
              }}
            >
              <ExternalLink />
              {t('caseExploration.case.actions.view_assay')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default ActionsMenuCell;
