import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../shadcn/accordion';
import { Card } from '../shadcn/card';

function QueryBuilder() {
  return (
    <Card className="py-0">
      <Accordion type="multiple" defaultValue={['query-builder']}>
        <AccordionItem value="query-builder" className="border-none">
          <AccordionTrigger
            className="border-b py-0 px-6 data-[state=closed]:rounded-sm data-[state=closed]:border-none hover:cursor-pointer"
            asChild
          >
            Query Builder V3
          </AccordionTrigger>
          <AccordionContent className="py-4 px-6 space-y-4">
            <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-scroll">Content</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
export default QueryBuilder;
