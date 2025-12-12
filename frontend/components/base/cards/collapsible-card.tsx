import { useState } from 'react';
import { Collapsible, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { CollapsibleContent } from '@/components/base/shadcn/collapsible';

type CollapsibleCardProps = {
  defaultOpen?: boolean;
  children: React.ReactElement;
  title: string;
};
function CollapsibleCard({ defaultOpen = false, title, children }: CollapsibleCardProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <CollapsibleTrigger className="flex justify-start">
            <CardTitle className="flex items-center justify-start gap-2 ">
              {open ? <ChevronUp /> : <ChevronDown />} <span>{title}</span>
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>
        <CardContent>
          <CollapsibleContent>{children}</CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}
export default CollapsibleCard;
