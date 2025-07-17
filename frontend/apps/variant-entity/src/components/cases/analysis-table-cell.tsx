import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

interface AnalysisTableCellProps {
  analysisCode: string | undefined;
  analysisName: string | undefined;
}

const AnalysisTableCell = ({ analysisCode, analysisName }: AnalysisTableCellProps) => {
  if (!analysisCode || !analysisName) {
    return <div>-</div>;
  }

  return (
    <div className="text-muted-foreground">
      <Tooltip>
        <TooltipTrigger>{analysisCode}</TooltipTrigger>
        <TooltipContent>{analysisName}</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default AnalysisTableCell;
