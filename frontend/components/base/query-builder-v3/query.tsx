import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Card } from '@/components/base/shadcn/card';

import { useQBContext } from './hooks/query-builder-context';

function Query() {
  const { activeQuery } = useQBContext();
  console.log('activeQuery', activeQuery);
  return (
    <Card className="py-0">
      <Accordion type="multiple" defaultValue={['query-builder']}>
        <AccordionItem value="query-builder" className="border-none">
          <AccordionTrigger
            className="border-b py-0 px-6 data-[state=closed]:rounded-sm data-[state=closed]:border-none hover:cursor-pointer"
            asChild
          >
            Title Placeholder
          </AccordionTrigger>
          <AccordionContent className="py-4 px-6 space-y-4">
            <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-scroll">{activeQuery?.field}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
export default Query;
