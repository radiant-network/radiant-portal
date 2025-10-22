import PreviewSheetAssayDetails, { PreviewSheetAssayDetailsProps } from './preview-sheet-assay-details';

type PreviewSheetSubHeaderProps = PreviewSheetAssayDetailsProps & {
  actions: React.ReactNode;
};

function PreviewSheetSubHeader({ probandId, seqId, actions }: PreviewSheetSubHeaderProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full">
      <PreviewSheetAssayDetails probandId={probandId} seqId={seqId} />
      {actions}
    </div>
  );
}

export default PreviewSheetSubHeader;
