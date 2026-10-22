import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';

type ImagingViewerCellProps = {
  sessionName: string;
  flywheelUrl?: string;
};

function ImagingViewerCell({ sessionName, flywheelUrl }: ImagingViewerCellProps) {
  if (!flywheelUrl) return <>{sessionName}</>;
  return (
    <AnchorLinkCell href={flywheelUrl} external target="_blank" rel="noopener noreferrer">
      {sessionName}
    </AnchorLinkCell>
  );
}

export default ImagingViewerCell;
