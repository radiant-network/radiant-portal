import { cn } from "@/lib/utils";

type EmptyCellProps = {
  className?: string;
};

function EmptyCell({ className }: EmptyCellProps) {
  return (
    <div
      className={cn("flex items-center justify-center font-bold", className)}
    >
      -
    </div>
  );
}

export default EmptyCell;
