import { useI18n } from '@/components/hooks/i18n';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../shadcn/sheet';

import NotesContainer, { NotesContainerProps } from './notes-container';

type NotesSliderProps = NotesContainerProps;

function NotesSlider({ ...props }: NotesSliderProps) {
  const { t } = useI18n();
  return (
    <Sheet open={true}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0 gap-0">
        <SheetHeader className="px-6 py-4">
          <SheetTitle>{t('notes.variant.title')}</SheetTitle>
          <SheetDescription className="sr-only">{t('notes.variant.title')}</SheetDescription>
        </SheetHeader>
        <NotesContainer enableEmptyIcon {...props} />
      </SheetContent>
    </Sheet>
  );
}
export default NotesSlider;
