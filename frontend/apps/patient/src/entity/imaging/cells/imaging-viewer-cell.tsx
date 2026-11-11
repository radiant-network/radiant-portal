import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import { useI18n } from '@/components/hooks/i18n';

type ImagingViewerCellProps = {
  sessionName: string;
  flywheelUrl?: string;
  clinicalReportUrl?: string;
};

function ImagingViewerCell({ sessionName, flywheelUrl, clinicalReportUrl }: ImagingViewerCellProps) {
  const { t } = useI18n();
  const sessionNode = flywheelUrl ? (
    <AnchorLinkCell href={flywheelUrl} external target="_blank" rel="noopener noreferrer">
      {sessionName}
    </AnchorLinkCell>
  ) : (
    <>{sessionName}</>
  );

  if (!clinicalReportUrl) return sessionNode;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {sessionNode}
      <AnchorLinkCell
        href={clinicalReportUrl}
        external
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap"
      >
        {t('patient_entity.imaging.livai_report')}
      </AnchorLinkCell>
    </div>
  );
}

export default ImagingViewerCell;
