import { useI18n } from '@/components/hooks/i18n';

import { ArrayTenOrMore, QueryBuilderDictionary } from './types';

export const useQueryBuilderDictionary = (): QueryBuilderDictionary => {
  const { t } = useI18n();

  return {
    queryBar: {
      empty: t('common.query_bar.empty'),
      deletePopover: {
        title: t('common.query_bar.delete_popover.title'),
        cancel: t('common.query_bar.delete_popover.cancel'),
        ok: t('common.query_bar.delete_popover.ok'),
      },
      customPill: {
        createTooltip: t('common.query_bar.custom_pill.create_tooltip'),
        cannotSaveAsCustomPill: t('common.query_bar.custom_pill.cannot_save_as_custom_pill'),
      },
      saveDialog: {
        title: t('common.query_bar.save_dialog.title'),
        fields: {
          title: {
            label: t('common.query_bar.save_dialog.fields.title.label'),
            placeholder: t('common.query_bar.save_dialog.fields.title.placeholder'),
          },
        },
        notice: t('common.query_bar.save_dialog.notice'),
        cancel: t('common.query_bar.save_dialog.cancel'),
        ok: t('common.query_bar.save_dialog.ok'),
      },
    },
    queryPill: {
      operator: {
        changeOperatorTo: t('common.query_pill.operator.change_operator_to'),
        and: t('common.query_pill.operator.and'),
        or: t('common.query_pill.operator.or'),
      },
      facet: key => t(`common.filters.labels.${key}`, { defaultValue: key }),
      customPill: {
        editDialog: {
          title: t('common.query_pill.custom_pill.edit_dialog.title'),
          cancel: t('common.query_pill.custom_pill.edit_dialog.cancel'),
          ok: t('common.query_pill.custom_pill.edit_dialog.ok'),
        },
        cantBeEmptyDialog: {
          title: t('common.query_pill.custom_pill.cant_be_empty_dialog.title'),
          description: t('common.query_pill.custom_pill.cant_be_empty_dialog.description'),
          ok: t('common.query_pill.custom_pill.cant_be_empty_dialog.ok'),
        },
        titleExistsDialog: {
          title: t('common.query_pill.custom_pill.title_exists_dialog.title'),
          description: t('common.query_pill.custom_pill.title_exists_dialog.description'),
          ok: t('common.query_pill.custom_pill.title_exists_dialog.ok'),
        },
        saveDialog: {
          title: t('common.query_pill.custom_pill.save_dialog.title'),
          confirmationMessage: t(
            'common.query_pill.custom_pill.save_dialog.confirmation_message',
          ) as `${string}{title}${string}`,
          affectedFilters: t('common.query_pill.custom_pill.save_dialog.affected_filters'),
          cancel: t('common.query_pill.custom_pill.save_dialog.cancel'),
          ok: t('common.query_pill.custom_pill.save_dialog.ok'),
        },
      },
    },
    toolbar: {
      combine: t('common.toolbar.combine'),
      newQuery: t('common.toolbar.newQuery'),
      clearAll: t('common.toolbar.clear_all'),
      clearAllDialog: {
        title: t('common.toolbar.clear_all_dialog.title'),
        description: t('common.toolbar.clear_all_dialog.description'),
        cancel: t('common.toolbar.clear_all_dialog.cancel'),
        ok: t('common.toolbar.clear_all_dialog.ok'),
      },
      labels: t('common.toolbar.labels'),
    },
    savedFilter: {
      deleteTooltip: t('common.saved_filter.delete_tooltip'),
      deleteDialog: {
        title: t('common.saved_filter.delete_dialog.title'),
        description: t('common.saved_filter.delete_dialog.description'),
        cancel: t('common.saved_filter.delete_dialog.cancel'),
        ok: t('common.saved_filter.delete_dialog.ok'),
      },
      duplicateTooltip: t('common.saved_filter.duplicate_tooltip'),
      overwriteDialog: {
        title: t('common.saved_filter.overwrite_dialog.title'),
        description: t('common.saved_filter.overwrite_dialog.description'),
        cancel: t('common.saved_filter.overwrite_dialog.cancel'),
        ok: t('common.saved_filter.overwrite_dialog.ok'),
      },
      editDialog: {
        title: t('common.saved_filter.edit_dialog.title'),
        cancel: t('common.saved_filter.edit_dialog.cancel'),
        ok: t('common.saved_filter.edit_dialog.ok'),
        fields: {
          title: {
            label: t('common.saved_filter.edit_dialog.fields.title.label'),
            placeholder: t('common.saved_filter.edit_dialog.fields.title.placeholder'),
          },
        },
      },
      myFilters: t('common.saved_filter.my_filters'),
      manageFilters: t('common.saved_filter.manage_filters'),
      manageDialog: {
        title: t('common.saved_filter.manage_dialog.title'),
        close: t('common.saved_filter.manage_dialog.close'),
        lastSaveAt: t('common.saved_filter.manage_dialog.last_save_at') as `${string}{lastSaveAt}${string}`,
      },
      newFilter: t('common.saved_filter.new_filter'),
      saveTooltip: {
        whenEmpty: t('common.saved_filter.save_tooltip.when_empty'),
        whenDirty: t('common.saved_filter.save_tooltip.when_dirty'),
        default: t('common.saved_filter.save_tooltip.default'),
      },
      shareTooltip: {
        whenNotSaved: t('common.saved_filter.share_tooltip.when_not_saved'),
        default: t('common.saved_filter.share_tooltip.default'),
      },
      favoriteTooltip: {
        set: t('common.saved_filter.favorite_tooltip.set'),
        unset: t('common.saved_filter.favorite_tooltip.unset'),
      },
      discardTooltip: t('common.saved_filter.discard_tooltip'),
      noSavedFilters: t('common.saved_filter.no_saved_filters'),
      notifications: {
        created: t('common.saved_filter.notifications.created'),
        deleted: t('common.saved_filter.notifications.deleted'),
        updated: t('common.saved_filter.notifications.updated'),
        errors: {
          duplicated: t('common.saved_filter.notifications.errors.duplicated'),
          fetching: t('common.saved_filter.notifications.errors.fetching'),
          updated: t('common.saved_filter.notifications.errors.updated'),
          deleted: t('common.saved_filter.notifications.errors.deleted'),
          created: t('common.saved_filter.notifications.errors.created'),
        },
      },
    },
  };
};

export const defaultQueryReferenceColors: ArrayTenOrMore<string> = [
  '#C31D7E',
  '#328536',
  '#AA00FF',
  '#C2410C',
  '#047ABE',
  '#E5231F',
  '#007D85',
  '#C51162',
  '#7B5A90',
  '#B85C00',
  '#722ED1',
  '#4D7C0F',
  '#9F1239',
  '#2D7D9A',
  '#847545',
];
