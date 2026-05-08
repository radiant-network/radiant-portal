import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

type InterpretationVariantHeaderProps = {
  case_type?: string;
  locus_id?: string;
  hgvsg?: string;
  relationship_to_proband?: string;
  seqId: number;
  patientId?: number;
};

function InterpretationVariantHeader({
  case_type,
  patientId,
  locus_id,
  hgvsg,
  relationship_to_proband,
  seqId,
}: InterpretationVariantHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 self-stretch">
        {t('variant.interpretation_form.title')}
        <AnchorLink href={`/variants/entity/${locus_id}`} size="lg">
          <span className="min-w-28 max-w-56 overflow-hidden text-ellipsis">{hgvsg}</span>
        </AnchorLink>
        <Badge>{t(`variant.interpretation_form.header.${case_type}`)}</Badge>
      </div>
      <div className="flex items-center gap-4 self-stretch text-xs">
        <div className="flex items-center gap-2">
          <span>
            {t('variant.interpretation_form.header.patient')}
            <span className="font-normal ml-1">{patientId}</span>
          </span>
          <Badge variant="outline">
            {relationship_to_proband
              ? t(`common.relationships.${relationship_to_proband}`)
              : t('case_entity.patient_information.proband')}
          </Badge>
        </div>
        <span>
          {t('variant.interpretation_form.header.sequencing')}
          <span className="font-normal ml-1">{seqId}</span>
        </span>
      </div>
    </div>
  );
}

export default InterpretationVariantHeader;
