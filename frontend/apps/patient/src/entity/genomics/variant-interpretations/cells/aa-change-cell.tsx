import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { useI18n } from '@/components/hooks/i18n';

type AaChangeCellProps = {
  value?: string;
};

function AaChangeCell({ value }: AaChangeCellProps) {
  const { t } = useI18n();

  if (!value) return <EmptyCell />;

  return (
    <TextTooltipCell tooltipText={t('patient_entity.genomics.interpretations.aa_tooltip')}>
      <span className="font-mono text-xs">{value}</span>
    </TextTooltipCell>
  );
}

export default AaChangeCell;
