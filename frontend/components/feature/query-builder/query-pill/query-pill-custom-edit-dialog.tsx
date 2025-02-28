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
import { openCustomPillCantBeEmptyDialog } from "../alerts";

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

  const coreQuery = customQueryBuilder.getQueries()[0];
  const coreSavedFilter = customQueryBuilder.getSelectedSavedFilter();
  const hasChanged = title !== queryPill.title || coreSavedFilter?.isDirty();

  const handleOnOpenChange = useCallback(
    function (open: boolean) {
      if (open) {
        onOpenChange(true);
      } else {
        customQueryBuilder.reset();
        onOpenChange(false);
      }
    },
    [onOpenChange, customQueryBuilder]
  );

  const handleSave = useCallback(
    function () {
      // TODO: Before updating check:
      // 1. If the query is empty, show an alert
      // 2. If title is updated, validate the title
      // 3. Fetch filtersByPill, show alert and optionaly show affected filters

      if (coreQuery.isEmpty()) {
        openCustomPillCantBeEmptyDialog(dict);
      } else {
        coreSavedFilter?.save(SavedFilterTypeEnum.Query, {
          title,
        });
      }
    },
    [coreQuery, coreSavedFilter, dict, title]
  );

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
              <div data-query-active className="flex group/query">
                <QueryBarContext.Provider value={{ query: coreQuery }}>
                  <QueryPillBoolean sqon={coreQuery.raw()} />
                </QueryBarContext.Provider>
              </div>
              <DialogFooter className="mt-5">
                <DialogClose asChild>
                  <Button variant="outline">
                    {dict.queryPill.customPill.editDialog.cancel}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="primary"
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
