import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';
import { useTenantPath } from '@/components/hooks/use-tenant';

type SliderOccurrenceSubHeader = {
  hgvsg: string;
  locusId: string;
  actions: React.ReactNode;
  type?: string;
};

function SliderOccurrenceSubHeader({ hgvsg, locusId, actions, type = 'germline' }: SliderOccurrenceSubHeader) {
  const { t } = useI18n();
  const tenantPath = useTenantPath();
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full">
      <div className="flex gap-3">
        <AnchorLink
          href={tenantPath(`/variants/entity/${locusId}`)}
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
          {t(`preview_sheet.header.${type}`)}
        </Badge>
      </div>
      {actions}
    </div>
  );
}

export default SliderOccurrenceSubHeader;
