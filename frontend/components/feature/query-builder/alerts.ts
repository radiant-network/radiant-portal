import { alertDialog } from "@/components/base/dialog/alert-dialog-store";
import { QueryBuilderDictionary } from "./types";
import {
  QueryBuilderInstance,
  SavedFilterInstance,
} from "@/components/model/query-builder-core";

export function openDeleteSavedFilterAlert(
  savedFilter: SavedFilterInstance,
  dict: QueryBuilderDictionary
) {
  alertDialog.open({
    type: "warning",
    title: dict.savedFilter.deleteDialog.title,
    description: dict.savedFilter.deleteDialog.description,
    cancelProps: {
      children: dict.savedFilter.deleteDialog.cancel,
    },
    actionProps: {
      variant: "destructive",
      onClick: () => savedFilter.delete(),
      children: dict.savedFilter.deleteDialog.ok,
    },
  });
}

export function openOverwriteSavedFilterAlert(
  queryBuilder: QueryBuilderInstance,
  dict: QueryBuilderDictionary
) {
  alertDialog.open({
    type: "warning",
    title: dict.savedFilter.overwriteDialog.title,
    description: dict.savedFilter.overwriteDialog.description,
    cancelProps: {
      children: dict.savedFilter.overwriteDialog.cancel,
    },
    actionProps: {
      onClick: () => queryBuilder.createSavedFilter(),
      children: dict.savedFilter.overwriteDialog.ok,
    },
  });
}

export function openCustomPillCantBeEmptyDialog(dict: QueryBuilderDictionary) {
  alertDialog.open({
    type: "error",
    title: dict.queryPill.customPill.cantBeEmptyDialod.title,
    description: dict.queryPill.customPill.cantBeEmptyDialod.description,
    hideCancel: true,
    actionProps: {
      children: dict.queryPill.customPill.cantBeEmptyDialod.ok,
    },
  });
}
