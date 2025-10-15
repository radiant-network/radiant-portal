import { ArrowUpRight, FolderOpen } from 'lucide-react';
import OccurrenceSheetCard from './occurence-sheet-card';
import { useI18n } from '@/components/hooks/i18n';
import { Button } from '@/components/base/ui/button';

const OccurrenceSheetCaseCard = () => {
  const { t } = useI18n();

  return (
    <OccurrenceSheetCard
      icon={FolderOpen}
      title={t('preview_sheet.case.title', { id: '12345' })}
      actions={
        <Button variant="outline" size="sm">
          {t('preview_sheet.case.actions.open_case')}
          <ArrowUpRight />
        </Button>
      }
    >
      <></>
    </OccurrenceSheetCard>
  );
};

export default OccurrenceSheetCaseCard;
