import { CopyIcon } from "lucide-react";
import { useQueryBarContext } from "./query-bar-context";
import { IconButton } from "@/components/base/Buttons";

function QueryBarDuplicateAction() {
  const { query } = useQueryBarContext();

  return <IconButton icon={CopyIcon} onClick={() => query.duplicate()} />;
}

export default QueryBarDuplicateAction;
