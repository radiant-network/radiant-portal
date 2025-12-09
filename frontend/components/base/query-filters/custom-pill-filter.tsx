import { useState } from 'react';
import {
  ChartColumn,
  ChartLine,
  ChartPie,
  ChartScatter,
  CopyIcon,
  ExternalLink,
  InfoIcon,
  PencilLineIcon,
  TrashIcon,
} from 'lucide-react';

import { SavedFilterType } from '@/api/api';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { useQueryBuilderDictionary } from '@/components/base/query-builder/data';
import { QueryBuilderContext, QueryBuilderDictContext } from '@/components/base/query-builder/query-builder-context';
import QueryPillCustomEditDialog from '@/components/base/query-builder/query-pill/query-pill-custom-edit-dialog';
import { QueryPillCustomConfig } from '@/components/base/query-builder/types';
import { Button } from '@/components/base/shadcn/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/base/shadcn/hover-card';
import { createSavedFilter, useQueryBuilder } from '@/components/cores/query-builder';
import { ISavedFilter, IUserSavedFilter } from '@/components/cores/saved-filter';
import { ISqonGroupFilter } from '@/components/cores/sqon';
import { useI18n } from '@/components/hooks/i18n';

export interface CustomPillFilterProps {
  customPills: IUserSavedFilter[];
  onSelectPill: (pill: IUserSavedFilter) => void;
  onSavePill: (pill: ISavedFilter) => Promise<IUserSavedFilter>;
  onDuplicatePill: (pill: ISavedFilter) => void;
  onDeletePill: (pillId: number) => void;
  validateCustomPillTitle: QueryPillCustomConfig['validateCustomPillTitle'];
  fetchSavedFiltersByCustomPillId: QueryPillCustomConfig['fetchSavedFiltersByCustomPillId'];
  learnMoreLink: string;
  savedFilterType: SavedFilterType;
}

/**
 * validateCustomPillTitle
 * fetchSavedFiltersByCustomPillId
 */

function CustomPillFilter({
  customPills,
  onSelectPill,
  onSavePill,
  onDuplicatePill,
  onDeletePill,
  validateCustomPillTitle,
  fetchSavedFiltersByCustomPillId,
  learnMoreLink,
  savedFilterType,
}: CustomPillFilterProps) {
  const { t } = useI18n();
  const defaultDictionary = useQueryBuilderDictionary();

  const [activeQueryPill, setActiveQueryPill] = useState<ISavedFilter | null>(null);

  const customQueryBuilder = useQueryBuilder({
    id: 'customPillFilterQueryBuilder',
    state: {
      activeQueryId: '', // Not used in this context
      selectedQueryIndexes: [], // Not used in this context
      queries: [], // Not used in this context
      // We use the customPills prop to initialize the saved filters
      // because this is required for the copy functionality
      savedFilters: customPills,
    },
    onCustomPillUpdate: async customPill => await onSavePill(customPill),
    savedFilterType,
  });

  const openConfirmDeleteDialog = (pill: IUserSavedFilter) =>
    alertDialog.open({
      type: 'warning',
      title: t('common.custom_pill_filter.delete_dialog.title', {
        defaultValue: 'Delete this query?',
      }),
      description: t('common.custom_pill_filter.delete_dialog.description', {
        title: pill.name,
        defaultValue: `You are about to delete this custom query "${pill.name}", which may affect your results."`,
      }),
      cancelProps: {
        children: t('common.custom_pill_filter.delete_dialog.cancel', {
          defaultValue: 'Cancel',
        }),
      },
      actionProps: {
        color: 'destructive',
        onClick: () => onDeletePill(+pill.id),
        children: t('common.custom_pill_filter.delete_dialog.ok', {
          defaultValue: 'Delete',
        }),
      },
    });

  const tipText = t('common.custom_pill_filter.info', {
    defaultValue: 'You can create custom queries by adding criteria to the query bar and clicking the save button.',
  });

  if (customPills.length === 0) {
    return (
      <div className="flex flex-col gap-3 justify-center">
        <div className="flex gap-1 justify-center items-center text-neutral">
          <ChartColumn size={20} />
          <ChartPie size={20} />
          <ChartLine size={20} />
          <ChartScatter size={20} />
        </div>
        <div className="text-sm text-center">{tipText}</div>
        <a className="flex justify-center" href={learnMoreLink} target="_blank" rel="noreferrer">
          <Button variant="link" className="py-0 h-5">
            {t('common.custom_pill_filter.learn_more', {
              defaultValue: 'Learn more',
            })}
            <ExternalLink />
          </Button>
        </a>
      </div>
    );
  }

  return (
    <QueryBuilderDictContext.Provider value={defaultDictionary}>
      <QueryBuilderContext.Provider
        value={{
          queryBuilder: customQueryBuilder,
          fetchQueryCount: async () => 0, // Not used in this context
          getQueryReferenceColor: () => '', // Not used in this context
          showLabels: true, // Not used in this context
          resolveSyntheticSqon: sqon => sqon as ISqonGroupFilter,
          customPillConfig: {
            enable: true, // Not used in this context
            queryBuilderEditId: 'subCustomPillFilterQueryBuilder', // Not used in this context
            fetchCustomPillById: (() => {}) as any, // Not used in this context
            validateCustomPillTitle,
            fetchSavedFiltersByCustomPillId,
          },
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            My Queries{' '}
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon size={16} />
              </HoverCardTrigger>
              <HoverCardContent side="left" className="w-[200px] space-y-3">
                <div className="text-sm">{tipText}</div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="space-y-3">
            {customPills.map(pill => (
              <div key={pill.id} className="flex gap-1.5 group">
                <button
                  className="flex items-center border-2 rounded-xs border-primary px-2 h-6 text-xs whitespace-nowrap overflow-hidden hover:underline"
                  onClick={() => onSelectPill(pill)}
                >
                  <span className="overflow-hidden text-ellipsis">{pill.name}</span>
                </button>
                <div className="hidden items-center group-hover:flex gap-1">
                  <Button
                    iconOnly
                    variant="ghost"
                    size="xs"
                    className="[&_svg]:size-3.5 size-5"
                    onClick={() => setActiveQueryPill(pill)}
                  >
                    <PencilLineIcon />
                  </Button>
                  <Button
                    iconOnly
                    variant="ghost"
                    size="xs"
                    className="[&_svg]:size-3.5 size-5"
                    onClick={() => onDuplicatePill(createSavedFilter(pill, customQueryBuilder).copy())}
                  >
                    <CopyIcon />
                  </Button>
                  <Button
                    iconOnly
                    variant="ghost"
                    size="xs"
                    className="[&_svg]:size-3.5 size-5"
                    onClick={() => openConfirmDeleteDialog(pill)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {activeQueryPill && (
          <QueryPillCustomEditDialog
            open={true}
            onOpenChange={() => setActiveQueryPill(null)}
            queryPill={activeQueryPill}
          />
        )}
      </QueryBuilderContext.Provider>
    </QueryBuilderDictContext.Provider>
  );
}

export default CustomPillFilter;
