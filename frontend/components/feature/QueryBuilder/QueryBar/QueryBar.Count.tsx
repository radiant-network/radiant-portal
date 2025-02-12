import { UsersIcon } from "lucide-react";

const QueryBarCount = () => {
  return (
    <div className="flex items-center gap-1">
      <UsersIcon size={14} />
      <span className="font-medium">12</span>
    </div>
  );
};

export default QueryBarCount;
