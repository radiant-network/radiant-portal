import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions';
import QueryBuilder from '@/components/feature/query-builder/query-builder';
import { defaultQueryReferenceColors } from '@/components/feature/query-builder/data';
import { Button } from '@/components/base/ui/button';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { v4 } from 'uuid';
import { UserIcon } from 'lucide-react';
import { generateRandomQuery, generateRandomUserSavedFilter } from './utils';

const mockDictionary = {
  queryBar: {
    empty: 'Use the search tools & facets on the left to build a query',
    deletePopover: {
      title: 'Delete this query?',
      cancel: 'Cancel',
      ok: 'Delete',
    },
    customPill: {
      createTooltip: 'Create a custom query',
      cannotSaveAsCustomPill: 'Custom queries cannot include other custom queries',
    },
    saveDialog: {
      title: 'Save this query',
      fields: {
        title: {
          label: 'Query name',
          placeholder: 'Untitled query',
        },
      },
      notice: 'You will find your saved queries in the sidebar under the "Queries" heading.',
      cancel: 'Cancel',
      ok: 'Save',
    },
  },
  queryPill: {
    operator: {
      changeOperatorTo: 'Change operator to',
      and: 'and',
      or: 'or',
    },
    facet: (key: string) => key,
    customPill: {
      editDialog: {
        title: 'Edit custom query',
        cancel: 'Cancel',
        ok: 'Save',
      },
      cantBeEmptyDialog: {
        title: 'Query cannot be empty',
        description: 'Your custom query must contain at least one criteria.',
        ok: 'Close',
      },
      titleExistsDialog: {
        title: 'Name already in use',
        description: 'A custom query with this name already exists. Please assign a unique name.',
        ok: 'Close',
      },
      saveDialog: {
        title: 'Edit this query?',
        confirmationMessage:
          `You are about to edit the custom query "{title}", which may affect your results.` as const,
        affectedFilters: 'Affected saved filters:',
        cancel: 'Cancel',
        ok: 'Save',
      },
    },
  },
  toolbar: {
    combine: 'Combine',
    newQuery: 'New query',
    clearAll: 'Clear all',
    clearAllDialog: {
      title: 'Delete all queries?',
      description: 'You are about to delete all your queries. They will be lost forever.',
      cancel: 'Cancel',
      ok: 'Delete',
    },
    labels: 'Labels',
  },
  savedFilter: {
    deleteTooltip: 'Delete filter',
    deleteDialog: {
      title: 'Permanently delete this filter?',
      description: 'You are about to permanently delete this filter and all of its queries.',
      cancel: 'Cancel',
      ok: 'Delete filter',
    },
    duplicateTooltip: 'Duplicate filter',
    overwriteDialog: {
      title: 'Unsaved changes',
      description: 'You are about to create a new filter; all modifications will be lost.',
      cancel: 'Cancel',
      ok: 'Create',
    },
    editDialog: {
      title: 'Edit filter',
      cancel: 'Cancel',
      ok: 'Save',
      fields: {
        title: {
          label: 'Title',
          placeholder: 'Untitled query',
        },
      },
    },
    myFilters: 'My Filters',
    manageFilters: 'Manage filters',
    manageDialog: {
      title: 'Manage filters',
      close: 'Close',
      lastSaveAt: `Last saved at: {lastSaveAt} ago` as const,
    },
    newFilter: 'New filter',
    saveTooltip: {
      whenEmpty: 'Add a query to save',
      whenDirty: 'Save changes',
      default: 'Save filter',
    },
    shareTooltip: {
      whenNotSaved: 'Save filter to share',
      default: 'Share (Copy url)',
    },
    favoriteTooltip: {
      set: 'Set as default filter',
      unset: 'Unset default filter',
    },
    discardTooltip: 'Discard unsaved changes',
    noSavedFilters: 'You have no saved filters',
  },
};

const meta = {
  title: 'QueryBuilder/Query Builder',
  component: QueryBuilder,
  args: {
    id: 'query-builder-id',
    enableCombine: true,
    enableFavorite: true,
    enableShowHideLabels: true,
    initialShowHideLabels: true,
    queryReferenceColors: defaultQueryReferenceColors,
    resolveSyntheticSqon: fn(),
    dictionary: mockDictionary,
  },
} satisfies Meta<typeof QueryBuilder>;

export default meta;

type Story = StoryObj<typeof meta>;

const qbId = 'query-builder-id';
const qbCustomPillId = 'query-builder-custom-pill-id';
const qbQueryPillFilterId = 'query-builder-query-pill-filter-id';

function TestingTools({ queryBuilderId }: { queryBuilderId: string }) {
  return (
    <div className="space-y-2">
      <div>Testing Tools:</div>
      <div className="flex border p-4 gap-2">
        <Button
          color="primary"
          size="sm"
          onClick={() => queryBuilderRemote.addQuery(queryBuilderId, generateRandomQuery())}
        >
          Add query
        </Button>
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            queryBuilderRemote.updateActiveQueryField(queryBuilderId, {
              field: 'field',
              value: ['new-value'],
            });
          }}
        >
          Add field to active query
        </Button>
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            queryBuilderRemote.updateActiveQueryField(queryBuilderId, {
              field: 'field',
              value: [],
            });
          }}
        >
          Remove field from active query
        </Button>
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    id: qbId,
    initialState: {
      ...queryBuilderRemote.getLocalQueryBuilderState(qbId),
      savedFilters: [
        {
          id: v4(),
          title: "Olivier's Filter",
          favorite: false,
          queries: [generateRandomQuery(), generateRandomQuery(), generateRandomQuery()],
        },
        {
          id: v4(),
          title: "Francis' Filter",
          favorite: false,
          queries: [generateRandomQuery(), generateRandomQuery()],
        },
        {
          id: v4(),
          title: "Luc's Filter",
          favorite: false,
          queries: [generateRandomQuery(), generateRandomQuery(), generateRandomQuery()],
        },
      ],
      selectedQueryIndexes: [],
    },
    fetchQueryCount: async () => Promise.resolve(15),
    onStateChange: fn(),
    onActiveQueryChange: fn(),
    onQueryCreate: fn(),
    onQueryDelete: fn(),
    onQuerySelectChange: fn(),
    onQueryUpdate: fn(),
    onCustomPillSave: fn(),
    onCustomPillUpdate: fn(),
    onSavedFilterCreate: fn(),
    onSavedFilterDelete: fn(),
    onSavedFilterSave: fn(),
    onSavedFilterUpdate: fn(),
  },
  render: args => {
    return (
      <div className="space-y-3">
        <QueryBuilder {...args} />
        <TestingTools queryBuilderId={qbId} />
      </div>
    );
  },
};

const customPillActiveQueryId = v4();

export const CustomPill: Story = {
  args: {
    id: qbCustomPillId,
    queryCountIcon: <UserIcon size={14} />,
    initialState: {
      activeQueryId: customPillActiveQueryId,
      queries: [generateRandomQuery(customPillActiveQueryId), generateRandomQuery()],
      savedFilters: [],
      selectedQueryIndexes: [],
    },
    fetchQueryCount: async () => Promise.resolve(15),
    onStateChange: fn(),
    onActiveQueryChange: fn(),
    onQueryCreate: fn(),
    onQueryDelete: fn(),
    onQuerySelectChange: fn(),
    onQueryUpdate: fn(),
    onCustomPillSave: filter => {
      action('onCustomPillSave')(filter);

      return new Promise(resolve => setTimeout(() => resolve(generateRandomUserSavedFilter(filter)), 750));
    },
    onCustomPillUpdate: filter => {
      action('onCustomPillUpdate')(filter);

      return new Promise(resolve => setTimeout(() => resolve(generateRandomUserSavedFilter(filter)), 750));
    },
    onSavedFilterCreate: fn(),
    onSavedFilterDelete: fn(),
    onSavedFilterSave: fn(),
    onSavedFilterUpdate: fn(),
    customPillConfig: {
      enable: true,
      queryBuilderEditId: 'qb-custom-pill-edit-id',
      fetchCustomPillById: () =>
        new Promise(resolve => setTimeout(() => resolve(generateRandomUserSavedFilter()), 750)),
      validateCustomPillTitle: () => new Promise(resolve => setTimeout(() => resolve(true), 750)),
      fetchSavedFiltersByCustomPillId: () =>
        new Promise(resolve =>
          setTimeout(() => resolve([generateRandomUserSavedFilter(), generateRandomUserSavedFilter()]), 750),
        ),
    },
  },
  render: args => {
    return <QueryBuilder {...args} />;
  },
};

export const QueryPillFilter: Story = {
  args: {
    id: qbQueryPillFilterId,
    initialState: {
      ...queryBuilderRemote.getLocalQueryBuilderState(qbQueryPillFilterId),
      savedFilters: [],
      selectedQueryIndexes: [],
    },
    fetchQueryCount: async () => Promise.resolve(15),
    onStateChange: fn(),
    onActiveQueryChange: fn(),
    onQueryCreate: fn(),
    onQueryDelete: fn(),
    onQuerySelectChange: fn(),
    onQueryUpdate: fn(),
    onSavedFilterCreate: fn(),
    onSavedFilterDelete: fn(),
    onSavedFilterSave: fn(),
    onSavedFilterUpdate: fn(),
    queryPillFacetFilterConfig: {
      enable: true,
      onFacetClick: filter => {
        action('onFacetClick')(filter);

        return <div className="italic text-sm">Insert Filter Content</div>;
      },
    },
  },
  render: args => {
    return (
      <div className="space-y-3">
        <QueryBuilder {...args} />
        <TestingTools queryBuilderId={qbQueryPillFilterId} />
      </div>
    );
  },
};
