import { useI18n } from '@/components/hooks/i18n';

import AnchorLink from '../navigation/anchor-link';
import { Badge } from '../shadcn/badge';

type SliderOccurrenceSubHeader = {
  hgvsg: string;
  locusId: string;
  actions: React.ReactNode;
};

function SliderOccurrenceSubHeader({ hgvsg, locusId, actions }: SliderOccurrenceSubHeader) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full">
      <div className="flex gap-3">
        <AnchorLink
          href={`/variants/entity/${locusId}`}
          size="default"
          mono
          target="_blank"
          rel="noreferrer"
          className="min-w-0 font-semibold"
          external
        >
          <span className="overflow-hidden text-ellipsis max-w-52">{hgvsg}</span>
        </AnchorLink>
        <Badge variant="secondary" className="bg-slate-500/20 text-slate-800 border-transparent">
          {t('preview_sheet.header.germline')}
        </Badge>
      </div>
      {actions}
    </div>
  );
}

export default SliderOccurrenceSubHeader;
