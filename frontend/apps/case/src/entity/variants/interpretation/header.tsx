import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Separator } from '@/components/base/shadcn/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type InterpretationVariantHeaderProps = {
  case_type?: string;
  seq_id: number;
  locus_id?: string;
  hgvsg?: string;
  relationship_to_proband?: string;
  analysis_catalog_code?: string;
  analysis_catalog_name?: string;
};

function InterpretationVariantHeader({
  case_type,
  seq_id,
  locus_id,
  hgvsg,
  relationship_to_proband,
  analysis_catalog_code,
  analysis_catalog_name,
}: InterpretationVariantHeaderProps) {
  const { t } = useI18n();

  if (!locus_id || !hgvsg) return null;

  return (
    <div className="flex items-center gap-4">
      <AnchorLink href={`/variants/entity/${locus_id}`} size="lg" external>
        <span className="max-w-72 overflow-hidden text-ellipsis">{hgvsg}</span>
      </AnchorLink>
      <Badge>{t(`variant.interpretation_form.header.${case_type}`)}</Badge>
      <Separator className="h-6" orientation="vertical" />
      <span className="capitalize">
        {relationship_to_proband ?? t('case_entity.patient_information.proband')} ({seq_id})
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="blue">{analysis_catalog_code}</Badge>
        </TooltipTrigger>
        <TooltipContent>{analysis_catalog_name}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default InterpretationVariantHeader;
