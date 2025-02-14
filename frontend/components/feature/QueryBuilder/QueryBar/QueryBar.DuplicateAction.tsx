import { CopyIcon } from "lucide-react";
import { useQueryBarContext } from "./QueryBar.Context";

const QueryBarDuplicateAction = () => {
  const { query } = useQueryBarContext();

  return (
    <CopyIcon
      size={16}
      className="hover:cursor-pointer"
      onClick={() => query.duplicate()}
    />
  );
};

export default QueryBarDuplicateAction;
