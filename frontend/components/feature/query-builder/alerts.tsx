import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { QueryBuilderDictionary } from './types';
import { QueryBuilderInstance, SavedFilterInstance } from '@/components/model/query-builder-core';
import { ISavedFilter } from '@/components/model/saved-filter';

export function openDeleteSavedFilterAlert(savedFilter: SavedFilterInstance, dict: QueryBuilderDictionary) {
  alertDialog.open({
    type: 'warning',
    title: dict.savedFilter.deleteDialog.title,
    description: dict.savedFilter.deleteDialog.description,
    cancelProps: {
      children: dict.savedFilter.deleteDialog.cancel,
    },
    actionProps: {
      color: 'destructive',
      onClick: () => savedFilter.delete(),
      children: dict.savedFilter.deleteDialog.ok,
    },
  });
}

export function openOverwriteSavedFilterAlert(queryBuilder: QueryBuilderInstance, dict: QueryBuilderDictionary) {
  alertDialog.open({
    type: 'warning',
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
    type: 'error',
    title: dict.queryPill.customPill.cantBeEmptyDialog.title,
    description: dict.queryPill.customPill.cantBeEmptyDialog.description,
    hideCancel: true,
    actionProps: {
      children: dict.queryPill.customPill.cantBeEmptyDialog.ok,
    },
  });
}

export function openCustomPillTitleExistsDialog(dict: QueryBuilderDictionary) {
  alertDialog.open({
    type: 'error',
    title: dict.queryPill.customPill.titleExistsDialog.title,
    description: dict.queryPill.customPill.titleExistsDialog.description,
    hideCancel: true,
    actionProps: {
      children: dict.queryPill.customPill.titleExistsDialog.ok,
    },
  });
}

export function openCustomPillSaveDialog(
  dict: QueryBuilderDictionary,
  title: string,
  associatedSavedFilters: ISavedFilter[] | undefined,
  onSave: () => Promise<void>,
) {
  alertDialog.open({
    type: 'warning',
    title: dict.queryPill.customPill.saveDialog.title,
    description: (
      <div className="space-y-4">
        <div>{dict.queryPill.customPill.saveDialog.confirmationMessage.replace('{title}', title)}</div>
        {associatedSavedFilters?.length && (
          <div className="border rounded p-4 space-y-2">
            <div className="font-medium text-foreground">{dict.queryPill.customPill.saveDialog.affectedFilters}</div>
            <ul className="list-disc list-inside">
              {associatedSavedFilters.map(filter => (
                <li className="list-item">{filter.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ),
    cancelProps: {
      children: dict.queryPill.customPill.saveDialog.cancel,
    },
    actionProps: {
      children: dict.queryPill.customPill.saveDialog.ok,
      onClick: async e => {
        e.preventDefault();
        return onSave();
      },
    },
  });
}
