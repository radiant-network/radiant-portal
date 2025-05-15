import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';
import { Circle, Square } from 'lucide-react';

type FamilySectionProps = {
  data: ExpendedOccurrence;
};

export default function FamilySection({ data }: FamilySectionProps) {
  const { t } = useI18n();

    const fatherTitle = (
      <span className='inline-flex gap-1 items-center'>{t('occurrenceExpend.family.fatherGenotype')} <Square className='w-[13px] h-[13px]' /></span>
    );

    const motherTitle = (
      <span className='inline-flex gap-1 items-center'>{t('occurrenceExpend.family.motherGenotype')} <Circle className='w-[13px] h-[13px]' /></span>
    );

  return (
    <DetailSection title={t('occurrenceExpend.family.title')}>
      <DetailItem title={fatherTitle} value={data.father_calls ? data.father_calls.map(call => call.toString()).join('/') : '-'} />
      <DetailItem title={motherTitle} value={data.mother_calls ? data.mother_calls.map(call => call.toString()).join('/') : '-'} />
    </DetailSection>
  );
}
