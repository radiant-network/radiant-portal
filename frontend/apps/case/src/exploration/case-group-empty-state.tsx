import { SearchIcon } from 'lucide-react';

import Empty from '@/components/base/empties/empty';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

type CaseGroupEmptyStateProps = {
  onShowAllCases: () => void;
};

function CaseGroupEmptyState({ onShowAllCases }: CaseGroupEmptyStateProps) {
  const { t } = useI18n();

  return (
    <Empty
      title={t('case_exploration.case_group.empty.title')}
      description={t('case_exploration.case_group.empty.description')}
      iconType="custom"
      icon={SearchIcon}
      size="mini"
    >
      <Button size="sm" variant="outline" onClick={onShowAllCases}>
        {t('case_exploration.case_group.empty.show_all')}
      </Button>
    </Empty>
  );
}

export default CaseGroupEmptyState;
