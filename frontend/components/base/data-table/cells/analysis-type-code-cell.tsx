import { Badge } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';
import { Biohazard, User, Users } from 'lucide-react';
import EmptyCell from './empty-cell';
import AnalysisTypeCodeBadge, { AnalysisTypeCode } from '../../badges/analysis-type-code-badge';

type AnalysisTypeCodeCellProps = {
  code: AnalysisTypeCode | undefined;
};

function AnalysisTypeCodeCell({ code }: AnalysisTypeCodeCellProps) {

  if (!code) return <EmptyCell />

  return <AnalysisTypeCodeBadge code={code} />;
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
