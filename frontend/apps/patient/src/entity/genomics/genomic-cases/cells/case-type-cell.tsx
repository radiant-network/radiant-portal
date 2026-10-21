import type { PatientCaseCaseTypeEnum } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type CaseTypeCellProps = {
  code?: string;
  caseType?: PatientCaseCaseTypeEnum;
};

function CaseTypeCell({ code, caseType }: CaseTypeCellProps) {
  const { t } = useI18n();

  if (!code && !caseType) return <EmptyCell />;

  const key = caseType ?? code;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="uppercase">
          {code}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{t(`patient_entity.genomics.cases.type.${key}`)}</TooltipContent>
    </Tooltip>
  );
}

export default CaseTypeCell;
