import { useContext } from 'react';

import { GermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Separator } from '@/components/base/shadcn/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { CaseEntityContext } from '../../case-entity';
import { SeqIDContext } from '../variants-tab';

type InterpretationVariantHeaderProps = {
  occurrence?: GermlineSNVOccurrence;
};

function InterpretationVariantHeader({ occurrence }: InterpretationVariantHeaderProps) {
  const { t } = useI18n();
  const caseEntity = useContext(CaseEntityContext);
  const seqId = useContext(SeqIDContext);

  if (!occurrence) return null;

  const member = caseEntity?.sequencing_experiments.find(caseSeqEx => caseSeqEx.seq_id === seqId);

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
          <Badge variant="blue">{caseEntity?.analysis_catalog_code}</Badge>
        </TooltipTrigger>
        <TooltipContent>{caseEntity?.analysis_catalog_name}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default InterpretationVariantHeader;
