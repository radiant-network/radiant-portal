import PreviewSheetSequencingExperimentDetails, {
  PreviewSheetSequencingExperimentDetailsProps,
} from './preview-sheet-sequencing-experiment-details';

type PreviewSheetSubHeaderProps = PreviewSheetSequencingExperimentDetailsProps & {
  actions: React.ReactNode;
};

function PreviewOccurrenceSubHeader({ patientId, relationshipToProband, seqId, actions }: PreviewSheetSubHeaderProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full">
      <PreviewSheetSequencingExperimentDetails
        patientId={patientId}
        relationshipToProband={relationshipToProband}
        seqId={seqId}
      />
      {actions}
    </div>
  );
}

export default PreviewOccurrenceSubHeader;
