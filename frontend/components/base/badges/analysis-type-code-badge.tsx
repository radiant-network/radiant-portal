import { Badge } from '@/components/base/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { Biohazard, User, Users } from 'lucide-react';

export type AnalysisTypeCode = 'somatic' | 'germline' | 'germline_family';

type AnalysisTypeCodeProps = {
  code: AnalysisTypeCode;
  size?: number;
};

const icons = {
  somatic: Biohazard,
  germline: User,
  germline_family: Users,
};

function AnalysisTypeCodeBadge({ code, size = 12 }: AnalysisTypeCodeProps) {
  const { t } = useI18n();

  const Icon = icons[code];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="neutral" iconOnly>
          <Icon size={size} />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{t(`caseExploration.analysis_type_code.${code}`)}</TooltipContent>
    </Tooltip>
  );
}

export default AnalysisTypeCodeBadge;
