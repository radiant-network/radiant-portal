import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type CanonicalBadgeProps = {
  size?: number;
};

function CanonicalBadge({ size = 18 }: CanonicalBadgeProps) {
  const { t } = useI18n();
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <TranscriptCanonicalIcon className="text-primary" size={size} />
      </TooltipTrigger>
      <TooltipContent>{t('occurrence.canonical')}</TooltipContent>
    </Tooltip>
  );
}

export default CanonicalBadge;
