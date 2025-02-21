import { CopyIcon } from "lucide-react";
import { useQueryBarContext } from "./QueryBar.Context";
import { IconButton } from "@/components/base/Buttons";

const QueryBarDuplicateAction = () => {
  const { query } = useQueryBarContext();

  return <IconButton icon={CopyIcon} onClick={() => query.duplicate()} />;
};

export default QueryBarDuplicateAction;
