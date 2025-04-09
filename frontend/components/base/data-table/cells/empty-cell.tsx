import { cn } from '@/components/lib/utils';
import { useI18n } from '@/components/hooks/i18n';

interface EmptyCellProps {
  className?: string;
}

function EmptyCell({ className }: EmptyCellProps) {
  const { t } = useI18n();
  return <div className={cn('flex items-center font-bold', className)}>{t('common.components.emptyCell')}</div>;
}

export default EmptyCell;
