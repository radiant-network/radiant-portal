import EmptyCell from "@/components/base/data-table/cells/empty-cell";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { useI18n } from "@/components/hooks/i18n";

type VariantClassCellProps = {
  value?: string;
};

function VariantClassCell({ value }: VariantClassCellProps) {
  const { t } = useI18n();
  
  if (!value) return <EmptyCell />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {t(`common.variant.classes.${value.toLowerCase()}`)}
        </TooltipTrigger>
        <TooltipContent>{value}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default VariantClassCell;
