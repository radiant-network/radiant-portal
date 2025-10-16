import { Button } from '@/components/base/ui/button';
import { ArrowUpRight, AudioLines } from 'lucide-react';
import PreviewCard from './preview-card';

const PreviewVariantDetailsCard = () => {
  return (
    <PreviewCard
      icon={AudioLines}
      title="Variant Details"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="xs">
            USCS <ArrowUpRight />
          </Button>
          <Button variant="outline" size="xs">
            LitVar <ArrowUpRight />
          </Button>
        </div>
      }
    >
      sd
    </PreviewCard>
  );
};

export default PreviewVariantDetailsCard;
