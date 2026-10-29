import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type ProbandSamplesCellProps = {
  sampleIds?: string[];
};

function ProbandSamplesCell({ sampleIds }: ProbandSamplesCellProps) {
  if (!sampleIds || sampleIds.length === 0) return <EmptyCell />;

  return (
    <div className="flex flex-col">
      {sampleIds.map(sampleId => (
        <span key={sampleId}>{sampleId}</span>
      ))}
    </div>
  );
}

export default ProbandSamplesCell;
