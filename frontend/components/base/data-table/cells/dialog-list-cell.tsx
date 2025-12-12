import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/base/shadcn/alert-dialog';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

import EmptyCell from './empty-cell';

type DialogListCellProps<T> = {
  header: string;
  items?: T[];
  renderItem: (item: T) => React.ReactElement;
  visibleCount: number;
};

function DialogListCell({ visibleCount, header, items = [], renderItem }: DialogListCellProps<any>) {
  const { t } = useI18n();
  if (items?.length === 0) return <EmptyCell />;

  if (items?.length <= visibleCount) {
    return (
      <div className="flex flex-col justify-normal items-baseline">
        {items.slice(0, visibleCount).map(item => renderItem(item))}
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex flex-col justify-normal items-baseline">
          {items.slice(0, visibleCount).map(item => renderItem(item))}
          <Button variant="link" size="xs" className="flex px-0 justify-normal">
            {t('common.actions.see_more')}
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>{header}</AlertDialogHeader>
        <AlertDialogDescription>
          <div className="flex flex-col gap-2 max-h-[600px] overflow-auto">{items.map(item => renderItem(item))}</div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.close')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DialogListCell;
