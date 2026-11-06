import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type TumorBoardRecommendationsCellProps = {
  recommendations: string[];
};

function TumorBoardRecommendationsCell({ recommendations }: TumorBoardRecommendationsCellProps) {
  if (!recommendations.length) return <EmptyCell />;
  return (
    <ul className="list-disc pl-4">
      {recommendations.map((item, i) => (
        <li key={`${i}-${item}`}>{item}</li>
      ))}
    </ul>
  );
}

export default TumorBoardRecommendationsCell;
