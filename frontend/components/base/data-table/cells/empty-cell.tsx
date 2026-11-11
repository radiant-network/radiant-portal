import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

interface EmptyCellProps {
  className?: string;
}

function EmptyCell({ className }: EmptyCellProps) {
  const { t } = useI18n();
  return <div className={cn('flex items-center font-bold', className)}>{t('common.components.empty_cell')}</div>;
}

export default EmptyCell;
