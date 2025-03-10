import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/ui/dialog";
import {
  QueryBuilderContext,
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../query-builder-context";
import {
  ISavedFilter,
  IUserSavedFilter,
  SavedFilterTypeEnum,
} from "@/components/model/saved-filter";
import EditableText from "@/components/base/editable-text";
import { Separator } from "@/components/base/ui/separator";
import { Button } from "@/components/base/ui/button";
import { useCallback, useState } from "react";
import QueryPillBoolean from "./query-pill-boolean";
import {
  updateQueriesWithCustomPill,
  useQueryBuilder,
} from "@/components/model/query-builder-core";
import { QueryBarContext } from "../query-bar/query-bar-context";
import {
  openCustomPillCantBeEmptyDialog,
  openCustomPillSaveDialog,
  openCustomPillTitleExistsDialog,
} from "../alerts";

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
  const { queryBuilder: rootQueryBuilder, customPillConfig } =
    useQueryBuilderContext();
  const customQueryBuilder = useQueryBuilder({
    id: customPillConfig?.queryBuilderEditId!,
    initialState: {
      activeQueryId: queryPill.queries[0].id,
      queries: queryPill.queries,
      savedFilters: [queryPill],
      selectedQueryIndexes: [],
    },
    onCustomPillUpdate: async (customPill) => {
      const result = await Promise.resolve(
        rootQueryBuilder.coreProps.onCustomPillUpdate?.(customPill)
      ).then((response) => {
        rootQueryBuilder.setState((prev) => ({
          ...prev,
          queries: updateQueriesWithCustomPill(prev.queries, customPill),
        }));

        onOpenChange(false);

        return response;
      });

      return result as IUserSavedFilter;
    },
  });

  const [title, setTitle] = useState(queryPill.title);
  const [saving, setSaving] = useState(false);

  const coreQuery = customQueryBuilder.getQueries()[0];
  const coreSavedFilter = customQueryBuilder.getSelectedSavedFilter();

  const titleChanged = title !== queryPill.title;
  const hasChanged = titleChanged || coreSavedFilter?.isDirty();

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        onOpenChange(true);
      } else {
        customQueryBuilder.reset();
        onOpenChange(false);
      }
    },
    [onOpenChange, customQueryBuilder]
  );

  const handleSave = useCallback(async () => {
    if (coreQuery.isEmpty()) {
      openCustomPillCantBeEmptyDialog(dict);
      return;
    }

    setSaving(true);

    if (titleChanged) {
      const valid = await customPillConfig?.validateCustomPillTitle(title);

      if (valid !== undefined && valid === false) {
        setSaving(false);
        openCustomPillTitleExistsDialog(dict);
        return;
      }
    }

    const associatedSavedFilters = await customPillConfig
      ?.fetchSavedFiltersByCustomPillId(queryPill.id)
      .finally(() => setSaving(false));

    openCustomPillSaveDialog(dict, title, associatedSavedFilters, async () =>
      coreSavedFilter?.save(SavedFilterTypeEnum.Query, {
        title,
      })
    );
  }, [coreQuery, coreSavedFilter, dict, title, queryPill.id, customPillConfig]);

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <QueryBuilderContext.Provider
        value={{
          queryBuilder: customQueryBuilder,
          fetchQueryCount: async () => 0,
          getQueryReferenceColor: () => "",
          showLabels: true,
        }}
      >
        <DialogContent className="flex flex-row gap-0 h-screen w-screen max-w-screen rounded-none border-none sm:rounded-none p-0">
          <aside className="flex flex-col min-w-48 bg-primary">
            <span className="italic">TODO Insert filters</span>
          </aside>
          <div className="w-full bg-gray-100">
            <div className="flex flex-col bg-white gap-6 p-6">
              <DialogHeader>
                <DialogTitle>
                  {dict.queryPill.customPill.editDialog.title}
                </DialogTitle>
              </DialogHeader>
              <Separator />
              <div>
                <EditableText onChangeText={setTitle}>{title}</EditableText>
              </div>
              <div data-query-active className="flex flex-wrap group/query">
                <QueryBarContext.Provider value={{ query: coreQuery }}>
                  <QueryPillBoolean
                    sqon={coreQuery.raw()}
                    customPillEditEnabled={true}
                  />
                </QueryBarContext.Provider>
              </div>
              <DialogFooter className="mt-5">
                <DialogClose asChild>
                  <Button variant="outlined">
                    {dict.queryPill.customPill.editDialog.cancel}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  color="primary"
                  loading={saving}
                  disabled={!hasChanged}
                  onClick={handleSave}
                >
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
