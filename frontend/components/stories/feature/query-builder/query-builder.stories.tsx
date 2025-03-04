import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { action } from "@storybook/addon-actions";

import QueryBuilder from "@/components/feature/query-builder/query-builder";
import {
  defaultDictionary,
  defaultQueryReferenceColors,
} from "@/components/feature/query-builder/data";
import { Button } from "@/components/base/ui/button";
import { queryBuilderRemote } from "@/components/model/query-builder-core/query-builder-remote";
import { v4 } from "uuid";
import {
  BooleanOperators,
  FieldOperators,
  ISyntheticSqon,
} from "@/components/model/sqon";
import { AlertDialogProvider } from "@/components/base/dialog/alert-dialog-provider";
import {
  ISavedFilter,
  IUserSavedFilter,
} from "@/components/model/saved-filter";
import { Spinner } from "@/components/base/spinner";

const meta = {
  title: "Feature/Query Builder",
  component: QueryBuilder,
  tags: ["autodocs"],
  args: {
    id: "query-builder-id",
    enableCombine: true,
    enableFavorite: true,
    enableShowHideLabels: true,
    initialShowHideLabels: true,
    queryReferenceColors: defaultQueryReferenceColors,
    dictionary: defaultDictionary,
  },
  decorators: [
    (Story) => (
      <AlertDialogProvider>
        <Story />
      </AlertDialogProvider>
    ),
  ],
} satisfies Meta<typeof QueryBuilder>;

export default meta;

type Story = StoryObj<typeof meta>;

const qbId = "query-builder-id";
const qbCustomPillId = "query-builder-custom-pill-id";
const qbQueryPillFilterId = "query-builder-query-pill-filter-id";

const randomElement = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min = 1, max = 100): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomString = () => Math.random().toString(36).substring(7);

const numericOperators: FieldOperators[] = [
  FieldOperators[">"],
  FieldOperators["<"],
  FieldOperators.between,
  FieldOperators[">="],
  FieldOperators["<="],
];

const generateRandomUserSavedFilter = (
  filter?: ISavedFilter
): IUserSavedFilter => ({
  id: v4(),
  title: filter?.title || `Custom Pill ${randomNumber(1, 50)}`,
  queries: [generateRandomQuery()],
  keycloak_id: v4(),
  creation_date: new Date().toISOString(),
  updated_date: new Date().toISOString(),
  tag: "tag",
  favorite: false,
});

const generateRandomValue = (operator: FieldOperators): (string | number)[] => {
  if (numericOperators.includes(operator)) {
    return Array.from({ length: 2 }, () => randomNumber());
  } else {
    return Array.from({ length: randomNumber(2, 5) }, () => randomString());
  }
};

const generateRandomQuery = (id: string = v4()): ISyntheticSqon => {
  const numConditions = randomNumber(1, 3);
  const conditions = Array.from({ length: numConditions }, () => {
    const op = randomElement(Object.values(FieldOperators));
    return {
      op,
      content: {
        field: `field_${randomString()}`,
        value: generateRandomValue(op),
      },
    };
  });

  return {
    id,
    op: randomElement(["and", "or"] as BooleanOperators[]),
    content: conditions as any,
  };
};

function TestingTools({ queryBuilderId }: { queryBuilderId: string }) {
  return (
    <div className="space-y-2">
      <div>Testing Tools:</div>
      <div className="flex border p-4 gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            queryBuilderRemote.addQuery(queryBuilderId, generateRandomQuery())
          }
        >
          Add query
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            queryBuilderRemote.updateActiveQueryField(queryBuilderId, {
              field: "field",
              value: ["new-value"],
            });
          }}
        >
          Add field to active query
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            queryBuilderRemote.updateActiveQueryField(queryBuilderId, {
              field: "field",
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
          queries: [
            generateRandomQuery(),
            generateRandomQuery(),
            generateRandomQuery(),
          ],
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
          queries: [
            generateRandomQuery(),
            generateRandomQuery(),
            generateRandomQuery(),
          ],
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
  render: (args) => {
    return (
      <div className="space-y-6">
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
    initialState: {
      activeQueryId: customPillActiveQueryId,
      queries: [
        generateRandomQuery(customPillActiveQueryId),
        generateRandomQuery(),
      ],
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
    onCustomPillSave: (filter) => {
      action("onCustomPillSave")(filter);

      return new Promise((resolve) =>
        setTimeout(() => resolve(generateRandomUserSavedFilter(filter)), 750)
      );
    },
    onCustomPillUpdate: (filter) => {
      action("onCustomPillUpdate")(filter);

      return new Promise((resolve) =>
        setTimeout(() => resolve(generateRandomUserSavedFilter(filter)), 750)
      );
    },
    onSavedFilterCreate: fn(),
    onSavedFilterDelete: fn(),
    onSavedFilterSave: fn(),
    onSavedFilterUpdate: fn(),
    customPillConfig: {
      enable: true,
      queryBuilderEditId: "qb-custom-pill-edit-id",
      fetchCustomPillById: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(generateRandomUserSavedFilter()), 750)
        ),
      validateCustomPillTitle: () =>
        new Promise((resolve) => setTimeout(() => resolve(true), 750)),
      fetchSavedFiltersByCustomPillId: () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve([
                generateRandomUserSavedFilter(),
                generateRandomUserSavedFilter(),
              ]),
            750
          )
        ),
    },
  },
  render: (args) => {
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
      onFacetClick: (filter) => {
        action("onFacetClick")(filter);

        return <div className="italic text-sm">Insert Filter Content</div>;
      },
    },
  },
  render: (args) => {
    return (
      <div className="space-y-6">
        <QueryBuilder {...args} />
        <TestingTools queryBuilderId={qbQueryPillFilterId} />
      </div>
    );
  },
};
