import AminoAcidChangeCell from '@/components/base/data-table/cells/amino-acid-change-cell';
import { useI18n } from '@/components/hooks/i18n';

type AaChangeCellProps = {
  value?: string;
};

function AaChangeCell({ value }: AaChangeCellProps) {
  const { t } = useI18n();

  return (
    <AminoAcidChangeCell
      value={value}
      description={t('patient_entity.genomics.interpretations.aa_tooltip')}
      className="text-xs"
    />
  );
}

export default AaChangeCell;
