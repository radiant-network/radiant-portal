import TranscriptManePlusIcon from '@/components/base/icons/transcript-mane-plus-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type ManePlusBadgeProps = {
  size?: number;
};

function ManePlusBadge({ size = 18 }: ManePlusBadgeProps) {
  const { t } = useI18n();
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <TranscriptManePlusIcon className="text-primary" size={size} />
      </TooltipTrigger>
      <TooltipContent>{t('occurrence.mane_plus')}</TooltipContent>
    </Tooltip>
  );
}

export default ManePlusBadge;
