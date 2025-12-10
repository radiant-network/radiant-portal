import { useCallback, useState } from 'react';

import { Sqon } from '@/api/api';
import EditableText from '@/components/base/data-entry/editable-text';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { Separator } from '@/components/base/shadcn/separator';
import { updateQueriesWithCustomPill, useQueryBuilder } from '@/components/cores/query-builder';
import { ISavedFilter, IUserSavedFilter, SavedFilterTypeEnum } from '@/components/cores/saved-filter';
import { ISqonGroupFilter, ISyntheticSqon } from '@/components/cores/sqon';

import { openCustomPillCantBeEmptyDialog, openCustomPillSaveDialog, openCustomPillTitleExistsDialog } from '../alerts';
import { QueryBarContext } from '../query-bar/query-bar-context';
import { QueryBuilderContext, useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

import QueryPillBoolean from './query-pill-boolean';

function QueryPillCustomEditDialog({
  open,
  onOpenChange,
  queryPill,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryPill: ISavedFilter;
}) {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder: rootQueryBuilder, customPillConfig } = useQueryBuilderContext();
  const customQueryBuilder = useQueryBuilder({
    id: customPillConfig?.queryBuilderEditId!,
    initialState: {
      activeQueryId: queryPill.queries[0].id,
      queries: queryPill.queries,
      savedFilters: [queryPill],
      selectedQueryIndexes: [],
    },
    onCustomPillUpdate: async customPill => {
      const result = await Promise.resolve(rootQueryBuilder.coreProps.onCustomPillUpdate?.(customPill)).then(
        response => {
          rootQueryBuilder.setState(prev => ({
            ...prev,
            queries: updateQueriesWithCustomPill(prev.queries as ISyntheticSqon[], customPill) as Sqon[],
          }));

          onOpenChange(false);

          return response;
        },
      );

      return result as IUserSavedFilter;
    },
    savedFilterType: queryPill.type,
  });

  const [name, setName] = useState(queryPill.name);
  const [saving, setSaving] = useState(false);

  const coreQuery = customQueryBuilder.getQueries()[0];
  const coreSavedFilter = customQueryBuilder.getSelectedSavedFilter();

  const nameChanged = name !== queryPill.name;
  const hasChanged = nameChanged || coreSavedFilter?.isDirty();

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        onOpenChange(true);
        return;
      }
      customQueryBuilder.reset();
      onOpenChange(false);
    },
    [onOpenChange, customQueryBuilder],
  );

  const handleSave = useCallback(async () => {
    if (coreQuery.isEmpty()) {
      openCustomPillCantBeEmptyDialog(dict);
      return;
    }

    setSaving(true);

    if (nameChanged) {
      const valid = await customPillConfig?.validateCustomPillTitle(name);

      if (valid !== undefined && valid === false) {
        setSaving(false);
        openCustomPillTitleExistsDialog(dict);
        return;
      }
    }

    const associatedSavedFilters = await customPillConfig
      ?.fetchSavedFiltersByCustomPillId(queryPill.id)
      .finally(() => setSaving(false));

    openCustomPillSaveDialog(dict, name, associatedSavedFilters, async () =>
      coreSavedFilter?.save(SavedFilterTypeEnum.Query, {
        name,
      }),
    );
  }, [coreQuery, coreSavedFilter, dict, name, queryPill.id, customPillConfig]);

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <QueryBuilderContext.Provider
        value={{
          queryBuilder: customQueryBuilder,
          fetchQueryCount: async () => 0,
          getQueryReferenceColor: () => '',
          showLabels: true,
          resolveSyntheticSqon: sqon => sqon as ISqonGroupFilter,
        }}
      >
        <DialogContent className="flex flex-row gap-0 h-screen w-screen max-w-screen rounded-none border-none sm:rounded-none p-0">
          <aside className="flex flex-col min-w-48 bg-primary">
            <span className="italic">TODO Insert filters</span>
          </aside>
          <div className="w-full">
            <div className="flex flex-col gap-6 p-6">
              <DialogHeader>
                <DialogTitle>{dict.queryPill.customPill.editDialog.title}</DialogTitle>
              </DialogHeader>
              <Separator />
              <div>
                <EditableText onChangeText={setName}>{name}</EditableText>
              </div>
              <div data-query-active className="flex flex-wrap group/query">
                <QueryBarContext.Provider value={{ query: coreQuery }}>
                  <QueryPillBoolean sqon={coreQuery.raw()} customPillEditEnabled={true} />
                </QueryBarContext.Provider>
              </div>
              <DialogFooter className="mt-5">
                <DialogClose asChild>
                  <Button variant="outline">{dict.queryPill.customPill.editDialog.cancel}</Button>
                </DialogClose>
                <Button type="submit" loading={saving} disabled={!hasChanged} onClick={handleSave}>
                  {dict.queryPill.customPill.editDialog.ok}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </QueryBuilderContext.Provider>
    </Dialog>
  );
}

export default QueryPillCustomEditDialog;
