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

  it("should not alter the initial queries of a saved filter when deleting a query", () => {
    const savedFilter: ISavedFilter = {
      id: "1",
      title: "Saved Filter 1",
      queries: defaultQueries,
      favorite: false,
    };

    expect(qb.getSelectedSavedFilter()).toBeNull();

    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.getQueries().length).toBe(2);
    expect(qb.getSelectedSavedFilter()?.getRawQueries()).toEqual(
      defaultQueries
    );

    qb.deleteQuery("1");

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.getQueries().length).toBe(2);
    expect(qb.getSelectedSavedFilter()?.getRawQueries()).toEqual(
      defaultQueries
    );
  });

  it("should return that the saved filter is dirty if query has changed", () => {
    const initialQueries: ISyntheticSqon[] = [
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

    const changedQueries = [
      initialQueries[0],
      {
        ...initialQueries[1],
        op: "or",
      },
    ];

    const savedFilter: ISavedFilter = {
      id: "1",
      title: "Saved Filter 1",
      queries: initialQueries,
      favorite: false,
    };

    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        ...state,
        queries: changedQueries,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.getQueries().length).toBe(2);
    expect(qb.getSelectedSavedFilter()?.getRawQueries()).toEqual(
      initialQueries
    );
    expect(qb.getSelectedSavedFilter()?.isDirty()).toBe(true);
  });

  it("should duplicate the selected saved filter and set the new one as selected", () => {
    const initialQueries: ISyntheticSqon[] = [
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

    const savedFilter: ISavedFilter = {
      id: "1",
      title: "Saved Filter 1",
      queries: initialQueries,
      favorite: false,
    };

    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        ...state,
        queries: initialQueries,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getState().savedFilters.length).toBe(1);

    qb.getSelectedSavedFilter()?.duplicate();

    const duplicatedQueries: ISyntheticSqon[] = [
      {
        ...initialQueries[0],
        id: mockUUID,
      },
      {
        ...initialQueries[1],
        id: mockUUID,
      },
    ];

    // Cant test that qb.getSelectedSavedFilter() is the new saved filter
    // Since this would only work with the real useQueryBuilderHook.
    // But we can check that the activeQueryId was updated with the ID of
    // the first query in the new savedFilter
    expect(state.activeQueryId).toBe(mockUUID);
    expect(state.queries).toEqual(duplicatedQueries);
    expect(state.savedFilters.length).toBe(2);
    expect(state.savedFilters[1].isNew).toBe(true);
    expect(state.savedFilters[1].isDirty).toBe(false);
    expect(state.savedFilters[1].id).toBe(mockUUID);
    expect(state.savedFilters[1].queries).toEqual(duplicatedQueries);
    expect(mockOnFilterCreate).toHaveBeenCalledTimes(1);
    expect(mockOnFilterCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockUUID,
        isNew: true,
        isDirty: false,
        favorite: false,
        queries: duplicatedQueries,
      })
    );
  });

  it("should create and set new selected saved filter when deleting the currently selected saved filter", async () => {
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

    expect(qb.getState().savedFilters.length).toBe(1);
    expect(qb.getState().activeQueryId).toBe("1");
    expect(qb.getState().savedFilters[0].id).toBe("1");
    expect(qb.getState().savedFilters[0].queries).toEqual(defaultQueries);

    qb.getSelectedSavedFilter()?.delete();

    // Cant test that qb.getSelectedSavedFilter() is the new saved filter
    // Since this would only work with the real useQueryBuilderHook.
    // But we can check that the activeQueryId was updated with the ID of
    // the first query in the new savedFilter
    expect(state.activeQueryId).toBe(mockUUID);
    expect(state.savedFilters.length).toBe(1);
    expect(state.savedFilters[0].isNew).toBe(true);
    expect(state.savedFilters[0].isDirty).toBe(false);
    expect(state.savedFilters[0].id).toBe(mockUUID);
    expect(state.savedFilters[0].queries).toEqual([getDefaultSyntheticSqon()]);
    expect(mockOnFilterDelete).toHaveBeenCalledTimes(1);
    expect(mockOnFilterDelete).toHaveBeenCalledWith("1");
  });

  // Test discardChanges
  // Test save saved filter
  // Test update saved filter
  // Test hasQueries
  // Test setAsFavorite
  // Test isFavorite
  // Test setTitle
  // Test isNew
  // Test isDirty
});
