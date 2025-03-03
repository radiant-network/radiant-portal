import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/base/ui/button";

type GeneCellProps = {
  className?: string;
  name: string;
  url: string;
  onClick: () => void;
};

function GeneCell({ className, url, name, onClick }: GeneCellProps) {
  return (
    <div className={cn("flex items-center text-blue-500", className)}>
      <a href={url} target="_blank">
        {name}
      </a>
      <Button onClick={onClick}>
        <PlusIcon />
      </Button>
    </div>
  );
}

export default GeneCell;
