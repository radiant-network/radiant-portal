import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PreviewSheetHeaderProps = {
  hgvsg: string;
  locusId: string;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
};

function PreviewSheetHeader({
  hgvsg,
  locusId,
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
}: PreviewSheetHeaderProps) {
  return (
    <div className="flex flex-row items-center size-full pr-8">
      <div className="flex flex-wrap gap-4 items-center pr-4 w-full min-w-0">
        <p className="text-slate-500">Occurrence</p>
        <AnchorLink
          href={`/variants/entity/${locusId}`}
          size="default"
          mono
          target="_blank"
          rel="noreferrer"
          variant="secondary"
          className="min-w-0"
          external
        >
          <span className="overflow-hidden text-ellipsis max-w-52">{hgvsg}</span>
        </AnchorLink>
        <Badge variant="secondary" className="bg-slate-500/20 text-slate-800 border-transparent">
          Germline
        </Badge>
      </div>
      <div className="flex gap-2 items-center justify-end">
        <Button variant="outline" iconOnly className="size-7 rounded-md" onClick={onPrevious} disabled={!hasPrevious}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" iconOnly className="size-7 rounded-md" onClick={onNext} disabled={!hasNext}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default PreviewSheetHeader;
