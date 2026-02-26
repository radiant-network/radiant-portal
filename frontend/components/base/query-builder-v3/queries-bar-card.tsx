import { useQBActiveQuery, useQBContext } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { isSqonEmpty } from '@/components/base/query-builder-v3/libs/sqon';
import QueryBar from '@/components/base/query-builder-v3/query-bar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Card } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

/**
 * Card that display all queries for query-builder
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * | Title                                                                   |
 * |─────────────────────────────────────────────────────────────────────────|
 * |  ┌───────┌──────────────────────────────────────────┐─────────────────┐ |
 * |  | [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  | |
 * |  └───────└──────────────────────────────────────────┘─────────────────┘ |
 * |  ┌───────┌──────────────────────────────────────────┐─────────────────┐ |
 * |  | [] Q2 | Ipsum > 60 [X]                  | 389K | [copy] [trash]  | |
 * |  └───────└──────────────────────────────────────────┘─────────────────┘ |
 * |  [New Query] (*) Label                                                  |
 * └─────────────────────────────────────────────────────────────────────────┘
 */
function QueriesBarCard() {
  const { t } = useI18n();
  const { sqons, activeQueryId } = useQBContext();
  const activeQuery = useQBActiveQuery();

  return (
    <Card className="py-0">
      <Accordion type="multiple" defaultValue={['query-builder']}>
        <AccordionItem value="query-builder" className="border-none">
          <AccordionTrigger
            className="border-b py-0 px-6 data-[state=closed]:rounded-sm data-[state=closed]:border-none hover:cursor-pointer"
            asChild
          >
            TODO
          </AccordionTrigger>
          <AccordionContent className="py-4 px-6 space-y-4">
            <div className="flex gap-2 max-h-[30vh] overflow-y-scroll">
              {sqons
                .filter(sqon => !isSqonEmpty(sqon))
                .map(sqon => (
                  <QueryBar key={sqon.id} sqon={sqon} active={activeQueryId === sqon.id} />
                ))}
              {isSqonEmpty(activeQuery) && t('common.query_bar.empty')}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
export default QueriesBarCard;
