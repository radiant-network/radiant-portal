import { ArrayTenOrMore, QueryBuilderDictionary } from "./types";

export const defaultDictionary: QueryBuilderDictionary = {
  queryBar: {
    empty: "Use the search tools & facets on the left to build a query",
    deletePopover: {
      title: "Delete this query?",
      cancel: "Cancel",
      ok: "Delete",
    },
    customPill: {
      createTooltip: "Create a custom query",
      cannotSaveAsCustomPill:
        "Custom queries cannot include other custom queries",
    },
    saveDialog: {
      title: "Save this query",
      fields: {
        title: {
          label: "Query name",
          placeholder: "Untitled query",
        },
      },
      notice:
        "You will find your saved queries in the sidebar under the “Queries” heading.",
      cancel: "Cancel",
      ok: "Save",
    },
  },
  queryPill: {
    operator: {
      changeOperatorTo: "Change operator to",
      and: "and",
      or: "or",
    },
    facet: (key) => key,
    customPill: {
      editDialog: {
        title: "Edit custom query",
        cancel: "Cancel",
        ok: "Save",
      },
      cantBeEmptyDialog: {
        title: "Query cannot be empty",
        description: "Your custom query must contain at least one criteria.",
        ok: "Close",
      },
      titleExistsDialog: {
        title: "Name already in use",
        description:
          "A custom query with this name already exists. Please assign a unique name.",
        ok: "Close",
      },
      saveDialog: {
        title: "Edit this query?",
        confirmationMessage:
          'You are about to edit the custom query "{title}", which may affect your results.',
        affectedFilters: "Affected saved filters:",
        cancel: "Cancel",
        ok: "Save",
      },
    },
  },
  toolbar: {
    combine: "Combine",
    newQuery: "New query",
    clearAll: "Clear all",
    clearAllDialog: {
      title: "Delete all queries?",
      description:
        "You are about to delete all your queries. They will be lost forever.",
      cancel: "Cancel",
      ok: "Delete",
    },
    labels: "Labels",
  },
  savedFilter: {
    deleteTooltip: "Delete filter",
    deleteDialog: {
      title: "Permanently delete this filter?",
      description:
        "You are about to permanently delete this filter and all of its queries.",
      cancel: "Cancel",
      ok: "Delete filter",
    },
    duplicateTooltip: "Duplicate filter",
    overwriteDialog: {
      title: "Unsaved changes",
      description:
        "You are about to create a new filter; all modifications will be lost.",
      cancel: "Cancel",
      ok: "Create",
    },
    editDialog: {
      title: "Edit filter",
      cancel: "Cancel",
      ok: "Save",
      fields: {
        title: {
          label: "Title",
          placeholder: "Untitled query",
        },
      },
    },
    myFilters: "My Filters",
    manageFilters: "Manage filters",
    manageDialog: {
      title: "Manage filters",
      close: "Close",
      lastSaveAt: "Last saved at: {lastSaveAt} ago",
    },
    newFilter: "New filter",
    saveTooltip: {
      whenEmpty: "Add a query to save",
      whenDirty: "Save changes",
      default: "Save filter",
    },
    shareTooltip: {
      whenNotSaved: "Save filter to share",
      default: "Share (Copy url)",
    },
    favoriteTooltip: {
      set: "Set as default filter",
      unset: "Unset default filter",
    },
    discardTooltip: "Discard unsaved changes",
    noSavedFilters: "You have no saved filters",
  },
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
