import { Badge } from '@/components/base/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { Biohazard, User, Users } from 'lucide-react';

type AnalysisTypeCodeCellProps = {
  code: 'somatic' | 'germline' | 'germline_family';
  size?: number;
};

const icons = {
  somatic: Biohazard,
  germline: User,
  germline_family: Users,
};

function AnalysisTypeCodeCell({ code, size = 12 }: AnalysisTypeCodeCellProps) {
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

export function AnalysisTypeCodeCellTooltips() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Badge variant="secondary" iconOnly>
          <Biohazard />
        </Badge>
        <span>{t(`caseExploration.analysis_type_code.somatic`)}</span>
      </div>
      <div className="flex gap-2">
        <Badge variant="secondary" iconOnly>
          <User />
        </Badge>
        <span>{t(`caseExploration.analysis_type_code.germline`)}</span>
      </div>
      <div className="flex gap-2">
        <Badge variant="secondary" iconOnly>
          <Users />
        </Badge>
        <span>{t(`caseExploration.analysis_type_code.germline_family`)}</span>
      </div>
    </div>
  );
}

export default AnalysisTypeCodeCell;
