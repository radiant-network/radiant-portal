import { ChevronLeft, ChevronRight } from 'lucide-react';

import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

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
  const { t } = useI18n();

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
          {t('preview_sheet.header.germline')}
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
