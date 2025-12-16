import PreviewSheetAssayDetails, { PreviewSheetAssayDetailsProps } from './preview-sheet-assay-details';

type PreviewSheetSubHeaderProps = PreviewSheetAssayDetailsProps & {
  actions: React.ReactNode;
};

function PreviewOccurrenceSubHeader({ patientId, relationshipToProband, seqId, actions }: PreviewSheetSubHeaderProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full">
      <PreviewSheetAssayDetails patientId={patientId} relationshipToProband={relationshipToProband} seqId={seqId} />
      {actions}
    </div>
  );
}

export default PreviewOccurrenceSubHeader;
