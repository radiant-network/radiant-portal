import { ArrayTenOrMore, QueryBuilderDictionary } from "./types";
import { useI18n } from '@/components/hooks/i18n';

export const useQueryBuilderDictionary = (): QueryBuilderDictionary => {
  const { t } = useI18n('common');

  return {
    queryBar: {
      empty: t('common.queryBar.empty'),
      deletePopover: {
        title: t('common.queryBar.deletePopover.title'),
        cancel: t('common.queryBar.deletePopover.cancel'),
        ok: t('common.queryBar.deletePopover.ok'),
      },
      customPill: {
        createTooltip: t('common.queryBar.customPill.createTooltip'),
        cannotSaveAsCustomPill: t('common.queryBar.customPill.cannotSaveAsCustomPill'),
      },
      saveDialog: {
        title: t('common.queryBar.saveDialog.title'),
        fields: {
          title: {
            label: t('common.queryBar.saveDialog.fields.title.label'),
            placeholder: t('common.queryBar.saveDialog.fields.title.placeholder'),
          },
        },
        notice: t('common.queryBar.saveDialog.notice'),
        cancel: t('common.queryBar.saveDialog.cancel'),
        ok: t('common.queryBar.saveDialog.ok'),
      },
    },
    queryPill: {
      operator: {
        changeOperatorTo: t('common.queryPill.operator.changeOperatorTo'),
        and: t('common.queryPill.operator.and'), 
        or: t('common.queryPill.operator.or'),
      },
      facet: (key) => t(`common.filters.labels.${key}`, { defaultValue: key }),
      customPill: {
        editDialog: {
          title: t('common.queryPill.customPill.editDialog.title'),
          cancel: t('common.queryPill.customPill.editDialog.cancel'),
          ok: t('common.queryPill.customPill.editDialog.ok'),
        },
        cantBeEmptyDialog: {
          title: t('common.queryPill.customPill.cantBeEmptyDialog.title'),
          description: t('common.queryPill.customPill.cantBeEmptyDialog.description'),
          ok: t('common.queryPill.customPill.cantBeEmptyDialog.ok'),
        },
        titleExistsDialog: {
          title: t('common.queryPill.customPill.titleExistsDialog.title'),
          description: t('common.queryPill.customPill.titleExistsDialog.description'),
          ok: t('common.queryPill.customPill.titleExistsDialog.ok'),
        },
        saveDialog: {
          title: t('common.queryPill.customPill.saveDialog.title'),
          confirmationMessage: t('common.queryPill.customPill.saveDialog.confirmationMessage') as `${string}{title}${string}`,
          affectedFilters: t('common.queryPill.customPill.saveDialog.affectedFilters'),
          cancel: t('common.queryPill.customPill.saveDialog.cancel'),
          ok: t('common.queryPill.customPill.saveDialog.ok'),
        },
      },
    },
    toolbar: {
      combine: t('common.toolbar.combine'),
      newQuery: t('common.toolbar.newQuery'),
      clearAll: t('common.toolbar.clearAll'),
      clearAllDialog: {
        title: t('common.toolbar.clearAllDialog.title'),
        description: t('common.toolbar.clearAllDialog.description'),
        cancel: t('common.toolbar.clearAllDialog.cancel'),
        ok: t('common.toolbar.clearAllDialog.ok'),
      },
      labels: t('common.toolbar.labels'),
    },
    savedFilter: {
      deleteTooltip: t('common.savedFilter.deleteTooltip'),
      deleteDialog: {
        title: t('common.savedFilter.deleteDialog.title'),
        description: t('common.savedFilter.deleteDialog.description'),
        cancel: t('common.savedFilter.deleteDialog.cancel'),
        ok: t('common.savedFilter.deleteDialog.ok'),
      },
      duplicateTooltip: t('common.savedFilter.duplicateTooltip'),
      overwriteDialog: {
        title: t('common.savedFilter.overwriteDialog.title'),
        description: t('common.savedFilter.overwriteDialog.description'),
        cancel: t('common.savedFilter.overwriteDialog.cancel'),
        ok: t('common.savedFilter.overwriteDialog.ok'),
      },
      editDialog: {
        title: t('common.savedFilter.editDialog.title'),
        cancel: t('common.savedFilter.editDialog.cancel'),
        ok: t('common.savedFilter.editDialog.ok'),
        fields: {
          title: {
            label: t('common.savedFilter.editDialog.fields.title.label'),
            placeholder: t('common.savedFilter.editDialog.fields.title.placeholder'),
          },
        },
      },
      myFilters: t('common.savedFilter.myFilters'),
      manageFilters: t('common.savedFilter.manageFilters'),
      manageDialog: {
        title: t('common.savedFilter.manageDialog.title'),
        close: t('common.savedFilter.manageDialog.close'),
        lastSaveAt: t('common.savedFilter.manageDialog.lastSaveAt') as `${string}{lastSaveAt}${string}`,
      },
      newFilter: t('common.savedFilter.newFilter'),
      saveTooltip: {
        whenEmpty: t('common.savedFilter.saveTooltip.whenEmpty'),
        whenDirty: t('common.savedFilter.saveTooltip.whenDirty'),
        default: t('common.savedFilter.saveTooltip.default'),
      },
      shareTooltip: {
        whenNotSaved: t('common.savedFilter.shareTooltip.whenNotSaved'),
        default: t('common.savedFilter.shareTooltip.default'),
      },
      favoriteTooltip: {
        set: t('common.savedFilter.favoriteTooltip.set'),
        unset: t('common.savedFilter.favoriteTooltip.unset'),
      },
      discardTooltip: t('common.savedFilter.discardTooltip'),
      noSavedFilters: t('common.savedFilter.noSavedFilters'),
    },
  };
};

export const defaultQueryReferenceColors: ArrayTenOrMore<string> = [
  "#C31D7E",
  "#328536",
  "#AA00FF",
  "#C2410C",
  "#047ABE",
  "#E5231F",
  "#007D85",
  "#C51162",
  "#7B5A90",
  "#B85C00",
  "#722ED1",
  "#4D7C0F",
  "#9F1239",
  "#2D7D9A",
  "#847545",
];
