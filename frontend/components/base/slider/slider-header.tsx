import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../shadcn/button';

type PreviewHeaderProps = {
  children: React.ReactElement;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
};

function SliderHeader({ children, onPrevious, onNext, hasPrevious = true, hasNext = true }: PreviewHeaderProps) {
  return (
    <div className="flex flex-row items-center size-full pr-8">
      <div className="flex flex-wrap gap-4 items-center pr-4 w-full min-w-0">{children}</div>
      <div className="flex gap-2 items-center justify-end">
        <Button variant="outline" iconOnly className="size-7 rounded-md" onClick={onPrevious} disabled={!hasPrevious}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" iconOnly className="size-7 rounded-md" onClick={onNext} disabled={!hasNext}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
export default SliderHeader;
