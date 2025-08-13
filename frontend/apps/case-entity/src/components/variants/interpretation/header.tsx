import { useContext } from 'react';

import { GermlineSNVOccurrence } from '@/api/api';
import { CaseEntityContext } from '@/App';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/ui/badge';
import { Separator } from '@/components/base/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { SeqIDContext } from '../variants-tab';

type InterpretationVariantHeaderProps = {
  occurrence?: GermlineSNVOccurrence;
};

function InterpretationVariantHeader({ occurrence }: InterpretationVariantHeaderProps) {
  const { t } = useI18n();
  const caseEntity = useContext(CaseEntityContext);
  const seqId = useContext(SeqIDContext);

  if (!occurrence) return null;

  const member = caseEntity?.assays.find(assay => assay.seq_id.toString() === seqId);

  return (
    <div className="flex items-center gap-4">
      <AnchorLink href={`/variants/entity/${occurrence.locus_id}`} size="lg" external>
        <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
      </AnchorLink>
      <Badge>{t('variant.interpretation_form.header.germline')}</Badge>
      <Separator className="h-6" orientation="vertical" />
      <span className="capitalize">
        {member?.relationship_to_proband ?? t('case_entity.patient_information.proband')} ({member?.seq_id})
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="blue">{caseEntity?.case_analysis_code}</Badge>
        </TooltipTrigger>
        <TooltipContent>{caseEntity?.case_analysis_name}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default InterpretationVariantHeader;
