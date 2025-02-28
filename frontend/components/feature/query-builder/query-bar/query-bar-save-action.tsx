import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { SaveIcon } from "lucide-react";
import { useQueryBuilderDictContext } from "../query-builder-context";
import QueryBarSaveDialog from "./query-bar-save-dialog";
import { useState } from "react";
import { useQueryBarContext } from "./query-bar-context";
import { IconButton } from "@/components/base/Buttons";

function QueryBarSaveAction() {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            icon={SaveIcon}
            onClick={() => setOpen(true)}
            disabled={query.hasCustomPill()}
          />
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px]">
          {query.hasCustomPill()
            ? dict.queryBar.customPill.cannotSaveAsCustomPill
            : dict.queryBar.customPill.createTooltip}
        </TooltipContent>
      </Tooltip>
      <QueryBarSaveDialog open={open} onOpenChange={setOpen} query={query} />
    </>
  );
}

export default QueryBarSaveAction;
