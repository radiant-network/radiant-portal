import EmptyCell from "@/components/base/data-table/cells/empty-cell";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";

type VariantClassCellProps = {
  value?: string;
};

function VariantClassCell({ value }: VariantClassCellProps) {
  if (!value) return <EmptyCell />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {{
            insertion: "Ins",
            deletion: "Del",
            snv: "SNV",
            null: "ND",
            indel: "Ind",
            substitution: "Sub",
            sequence_alteration: " SeqAlt",
          }[value.toLowerCase()] ?? null}
        </TooltipTrigger>
        <TooltipContent>{value}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default VariantClassCell;
