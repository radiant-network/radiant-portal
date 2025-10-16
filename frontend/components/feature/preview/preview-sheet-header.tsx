import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/ui/badge';

type PreviewSheetHeaderProps = {
  hgvsg: string;
};

function PreviewSheetHeader({ hgvsg }: PreviewSheetHeaderProps) {
  return (
    <div className="flex flex-row items-center size-full pr-8">
      <div className="flex flex-wrap gap-4 items-center pr-4 w-full min-w-0">
        <p className="text-slate-500">Occurence</p>
        <AnchorLink size="default" mono variant="secondary" className="min-w-0" external>
          <span className="overflow-hidden text-ellipsis max-w-52">{hgvsg}</span>
        </AnchorLink>
        <Badge variant="secondary" className="bg-slate-500/20 text-slate-800 border-transparent">
          Germline
        </Badge>
      </div>
      {/**
         * <div className="flex gap-2 items-center justify-end">
        <Button variant="outline" iconOnly className="size-7 rounded-md">
          <ChevronLeft />
        </Button>
        <Button variant="outline" iconOnly className="size-7 rounded-md">
          <ChevronRight />
        </Button>
      </div>
         */}
    </div>
  );
}

export default PreviewSheetHeader;
