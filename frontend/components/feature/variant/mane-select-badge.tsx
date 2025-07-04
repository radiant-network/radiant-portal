import TranscriptManeSelectIcon from "@/components/base/icons/transcript-mane-select-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/base/ui/tooltip";
import { useI18n } from "@/components/hooks/i18n";

type ManeSelectBadgeProps = {
  size?: number;
}

function ManeSelectBadge({ size = 18 }: ManeSelectBadgeProps) {
  const { t } = useI18n();
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <TranscriptManeSelectIcon className="text-primary" size={size} />
      </TooltipTrigger>
      <TooltipContent>{t("occurence.mane_select")}</TooltipContent>
    </Tooltip>
  )
}

export default ManeSelectBadge;
