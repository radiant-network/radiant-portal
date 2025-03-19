import { Occurrence } from '@/api/api';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Button } from '@/components/base/ui/button';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { Download, SquareArrowOutUpRightIcon } from 'lucide-react';
import InterpretationDialogButton from '../interpretation/interpretation-dialog-button';
import { Separator } from '@/components/base/ui/separator';

type GermlineVariantPreviewProps = {
  occurence: Occurrence;
};

function VariantTablePreview({ occurence }: GermlineVariantPreviewProps) {
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-8">
          <Button variant="link">
            <a href="#" className="flex text-lg gap-2 font-medium items-center justify-center outline-none">
              <span className="max-w-72 overflow-hidden text-ellipsis">{occurence.hgvsg}</span>
              <SquareArrowOutUpRightIcon />
            </a>
          </Button>
          <div className="flex gap-2">
            <InterpretationDialogButton color="primary" size="xs" occurence={occurence} />
            <Button color="primary" size="xs">
              <Download />
              Download report
            </Button>
            <Button color="primary" size="xs">
              <VariantIcon />
              Open IGV
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <pre style={{ fontSize: '10px' }}>
          <code>{JSON.stringify(occurence, null, 2)}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

export default VariantTablePreview;
