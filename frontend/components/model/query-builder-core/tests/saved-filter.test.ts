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
import { getDefaultSyntheticSqon } from "../utils/sqon";

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
let mockOnFilterDelete: Mock<Promise<{ savedFilterId: string }>, [any]>;
let mockOnFilterSave: Mock<Promise<ISavedFilter>, [any]>;

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

  it("should return the selected saved filter if set", () => {
    const savedFilter: ISavedFilter = {
      id: "1",
      title: "Saved Filter 1",
      queries: defaultQueries,
      favorite: false,
    };

    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.raw()).toEqual(savedFilter);
    expect(qb.getSelectedSavedFilter()?.isSelected()).toBe(true);
  });

  it("should return null as the selected saved filter if not set", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeNull();
  });

  it("should create a new saved filter", () => {
    expect(state.activeQueryId).toBe(defaultQueries[0].id);
    expect(state.savedFilters).toHaveLength(0);

    qb.createSavedFilter();

    const newSavedFilter: Partial<ISavedFilter> = {
      id: mockUUID,
      isNew: true,
      isDirty: false,
      favorite: false,
      queries: [getDefaultSyntheticSqon()],
    };

    expect(state.savedFilters).toHaveLength(1);
    expect(state.savedFilters[0]).toMatchObject(newSavedFilter);
    expect(state.activeQueryId).toBe(mockUUID);
    expect(mockOnFilterCreate).toBeCalledTimes(1);
    expect(mockOnFilterCreate).toBeCalledWith(
      expect.objectContaining(newSavedFilter)
    );
  });

  // Test if get that get queries returns the queries from the query builder if the savedFitler is selected
  // Test if get that get queries returns the queries from the savedFilter if the savedFilter is not selected
  // Test duplicate saved filter
  // Test delete saved filter
  // Test save saved filter
  // Test update saved filter
  // Test hasQueries
  // Test isFavorite
  // Test isNew
  // Test isDirty
});
