import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  test,
} from "@jest/globals";
import type { Mock } from "jest-mock";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  QueryBuilderInstance,
  QueryBuilderState,
} from "../query-builder";
import { ISavedFilter } from "../../saved-filter";
import { ISyntheticSqon } from "../../sqon";

const defaultQueries: ISyntheticSqon[] = [
  {
    id: "1",
    op: "and",
    content: [
      {
        content: {
          value: ["something"],
          field: "field1",
        },
        op: "in",
      },
    ],
  },
  {
    id: "2",
    op: "and",
    content: [
      {
        content: {
          value: ["something-else"],
          field: "field2",
        },
        op: "in",
      },
    ],
  },
];

let defaultProps: CoreQueryBuilderProps = {
  id: "test-query-builder",
  state: {
    activeQueryId: defaultQueries[0].id,
    queries: defaultQueries,
    selectedQueryIndexes: [],
    savedFilters: [],
  },
};

const mockUUID = "abababab-abab-4bab-abab-abababababab";

let qb: QueryBuilderInstance;
let state: QueryBuilderState = defaultProps.state;

let mockOnFilterCreate: Mock<void, [any]>;
let mockOnFilterUpdate: Mock<void, [any]>;
let mockOnFilterDelete: Mock<{ savedFilterId: string }, [any]>;
let mockOnFilterSave: Mock<ISavedFilter, [any]>;

describe("SavedFilters Manipulation", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: {
        getRandomValues: () =>
          // Will generate abababab-abab-4bab-abab-abababababab
          Buffer.from(Array.from({ length: 16 }, () => 0xab)),
      },
    });
  });

  beforeEach(() => {
    state = defaultProps.state;

    mockOnFilterCreate = jest.fn();
    mockOnFilterUpdate = jest.fn();
    mockOnFilterDelete = jest.fn();
    mockOnFilterSave = jest.fn();
    defaultProps.onSavedFilterCreate = mockOnFilterCreate;
    defaultProps.onSavedFilterUpdate = mockOnFilterUpdate;
    defaultProps.onSavedFilterDelete = mockOnFilterDelete;
    defaultProps.onSavedFilterSave = mockOnFilterSave;

    qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
      },
      onSavedFilterCreate: mockOnFilterCreate,
      onSavedFilterUpdate: mockOnFilterUpdate,
      onSavedFilterDelete: mockOnFilterDelete,
      onSavedFilterSave: mockOnFilterSave,
    });
  });

  it("test remote", () => {});
});
