import { Biohazard, User, Users } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

export type AnalysisTypeCode = 'somatic' | 'germline' | 'germline_family';

type AnalysisTypeCodeProps = {
  code: AnalysisTypeCode;
  size?: number;
  iconOnly?: boolean;
};

const icons = {
  somatic: Biohazard,
  germline: User,
  germline_family: Users,
};

function AnalysisTypeCodeBadge({ code, size = 12, iconOnly = false }: AnalysisTypeCodeProps) {
  const { t } = useI18n();

  const Icon = icons[code];
  const label = t(`case_exploration.analysis_type_code.${code}`);

  if (iconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" iconOnly>
            <Icon size={size} />
            <span className="sr-only">{label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Badge variant="secondary" className="max-w-full">
      <Icon size={size} />
      <span className="truncate" title={label}>
        {label}
      </span>
    </Badge>
  );
}

export default AnalysisTypeCodeBadge;
