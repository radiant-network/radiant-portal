import { Button } from "@/components/base/ui/button";

type ExternalLinkCellProps = {
  className?: string;
  url: string;
  children?: any;
};

function LinkCell({ className, url, children }: ExternalLinkCellProps) {
  return (
    <Button variant="link" className={className}>
      <a href={url}>{children}</a>
    </Button>
  );
}

export default LinkCell;
