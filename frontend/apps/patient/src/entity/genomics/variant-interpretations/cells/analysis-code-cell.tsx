import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { Badge } from '@/components/base/shadcn/badge';

type AnalysisCodeCellProps = {
  code?: string;
  name?: string;
};

function AnalysisCodeCell({ code, name }: AnalysisCodeCellProps) {
  if (!code) return <EmptyCell />;

  const badge = (
    <Badge className="uppercase" variant="secondary">
      {code}
    </Badge>
  );

  if (!name) return badge;

  return (
    <TextTooltipCell tooltipText={name} asChild>
      {badge}
    </TextTooltipCell>
  );
}

export default AnalysisCodeCell;
