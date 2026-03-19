import { useCallback } from 'react';
import { PlusIcon } from 'lucide-react';

import {
  QBActionType,
  useQBActiveQuery,
  useQBContext,
  useQBDispatch,
  useQBSettings,
} from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { isQueryEmpty, isSqonEmpty } from '@/components/base/query-builder-v3/libs/sqon';
import QueryBar from '@/components/base/query-builder-v3/query-bar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Card } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { alertDialog } from '../dialog/alert-dialog-store';
import { Button } from '../shadcn/button';
import { Switch } from '../shadcn/switch';

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
  const { labelsEnabled } = useQBSettings();
  const dispatch = useQBDispatch();
  const activeQuery = useQBActiveQuery();

  /**
   * Add and active a new query
   */
  const handleNewQueryOnClick = useCallback(() => {
    dispatch({
      type: QBActionType.ADD_QUERY,
    });
  }, [dispatch]);

  /**
   * Toggle labelsEnabled setting
   */
  const handleLabelsCheckedChange = useCallback(
    (checked: boolean) => {
      dispatch({
        type: QBActionType.SET_LABELS_ENABLED,
        payload: {
          labelsEnabled: checked,
        },
      });
    },
    [dispatch],
  );

  /**
   * Remove all queries
   */
  const handleClearOnClick = useCallback(() => {
    alertDialog.open({
      type: 'warning',
      title: t('common.toolbar.clear_all_dialog.title'),
      description: t('common.toolbar.clear_all_dialog.description'),
      cancelProps: {
        children: t('common.toolbar.clear_all_dialog.cancel'),
      },
      actionProps: {
        variant: 'destructive',
        onClick: () => {
          dispatch({
            type: QBActionType.REMOVE_ALL_QUERIES,
          });
        },
        children: t('common.toolbar.clear_all_dialog.ok'),
      },
    });
  }, []);

  return (
    <Card className="py-0">
      <Accordion type="multiple" defaultValue={['query-builder']}>
        <AccordionItem value="query-builder" className="border-none">
          <AccordionTrigger className="border-b py-0 px-6 data-[state=closed]:rounded-sm data-[state=closed]:border-none hover:cursor-pointer">
            TODO
          </AccordionTrigger>
          <AccordionContent className="py-4 px-6 space-y-4">
            <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-scroll">
              {sqons
                .filter(sqon => !isSqonEmpty(sqon))
                .map((sqon, index) => (
                  <QueryBar key={sqon.id} index={index + 1} sqon={sqon} active={activeQueryId === sqon.id} />
                ))}
              {isSqonEmpty(activeQuery) && t('common.query_bar.empty')}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Add New Query */}
                <Button size="xs" disabled={isQueryEmpty(sqons)} onClick={handleNewQueryOnClick}>
                  <PlusIcon />
                  {t('common.toolbar.new_query')}
                </Button>

                {/* Toggle labelsEnabled Settings */}
                <div className="flex items-center gap-1.5">
                  <Switch size="xs" checked={labelsEnabled} onCheckedChange={handleLabelsCheckedChange} />
                  {t('common.toolbar.labels')}
                </div>
              </div>

              {/* Remove all queries */}
              {sqons.length > 1 && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="no-underline enabled:hover:no-underline"
                    onClick={handleClearOnClick}
                  >
                    {t('common.toolbar.clear_all')}
                  </Button>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
export default QueriesBarCard;
