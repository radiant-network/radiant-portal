import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Card } from '@/components/base/shadcn/card';
import { TSyntheticSqonContentValue } from '@/components/cores/sqon';
import { useI18n } from '@/components/hooks/i18n';

import { useQBContext } from './hooks/use-query-builder';
import MultiSelectQueryPill from './pills/multiselect-query-pill';
import CombinerOperator from './pills/operators/combiner-operator';
import { ISyntheticSqon, IValueFacet } from './type';

type QueryBarProps = {
  sqon: ISyntheticSqon;
};

/**
 * Simple factory design pattern to create the correct query-pill
 */
function factory(content: TSyntheticSqonContentValue, displayCombiner: boolean) {
  return (
    <>
      <MultiSelectQueryPill content={content as IValueFacet} /> {displayCombiner && <CombinerOperator />}
    </>
  );
}

/**
 * Represent a single query.
 * A query is a combinaison of multiple sqon (multi-select, numerical, boolean etc.)
 */
function SqonQuery({ sqon }: QueryBarProps) {
  return sqon.content.map((content, index) => <>{factory(content, index < sqon.content.length - 1)}</>);
}

/**
 * Card that display all queries for query-builder
 */
function QueriesBarCard() {
  const { sqons } = useQBContext();
  const { t } = useI18n();

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
              {sqons.map(sqon => (
                <SqonQuery key={sqon.id} sqon={sqon} />
              ))}
              {sqons.length === 0 && t('common.query_bar.empty')}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
export default QueriesBarCard;
