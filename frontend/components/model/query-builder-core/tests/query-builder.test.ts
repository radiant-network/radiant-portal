import type { Mock } from "jest-mock";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import {
  createQueryBuilder,
  CoreQueryBuilderProps,
  QueryBuilderState,
  QueryBuilderInstance,
} from "../query-builder";
import {
  BooleanOperators,
  ISyntheticSqon,
  TSyntheticSqonContent,
} from "../../sqon";
import { getDefaultSyntheticSqon, isEmptySqon } from "../utils/sqon";

let defaultProps: CoreQueryBuilderProps = {
  id: "test-query-builder",
  state: {
    activeQueryId: "1",
    queries: [
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
    ],
    selectedQueryIndexes: [],
  },
};

let mockOnQueryCreate: Mock<void, [any]>;
let mockOnQueryUpdate: Mock<void, [any]>;
let mockOnQueryDelete: Mock<void, [any]>;
let mockOnQuerySelectChange: Mock<void, [any]>;
let mockOnStateChange: Mock<void, [any]>;

const mockUUID = "abababab-abab-4bab-abab-abababababab";

let qb: QueryBuilderInstance;
let state: QueryBuilderState = defaultProps.state;

describe("QueryBuilder Core", () => {
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
    mockOnQueryCreate = jest.fn();
    mockOnQueryUpdate = jest.fn();
    mockOnQueryDelete = jest.fn();
    mockOnStateChange = jest.fn();
    mockOnQuerySelectChange = jest.fn();
    defaultProps.onStateChange = mockOnStateChange;

    state = defaultProps.state;
    qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
        mockOnStateChange(newState);
      },
      onQueryCreate: mockOnQueryCreate,
      onQueryDelete: mockOnQueryDelete,
      onQueryUpdate: mockOnQueryUpdate,
      onQuerySelectChange: mockOnQuerySelectChange,
    });
  });

  it("should initialize with provided state", () => {
    expect(qb.coreProps.state).toEqual(defaultProps.state);
  });

  it("should update state when setCoreProps is called", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: { ...prev.state, activeQueryId: "new-id" },
    }));

    expect(qb.coreProps.state.activeQueryId).toBe("new-id");
  });

  it("should update state and trigger onStateChange", () => {
    qb.setState((prev) => ({ ...prev, activeQueryId: "new-id" }));

    expect(mockOnStateChange).toHaveBeenCalledTimes(1);

    const expectedHaveBeenCalledWith: QueryBuilderState = {
      ...defaultProps.state,
      activeQueryId: "new-id",
    };

    expect(mockOnStateChange).toHaveBeenCalledWith(expectedHaveBeenCalledWith);
  });

  it("should correctly reset the state to the initial state", () => {
    const initialState: QueryBuilderState = {
      activeQueryId: "initial-query-id",
      queries: [],
      selectedQueryIndexes: [],
    };

    qb.setCoreProps((prev) => ({
      ...prev,
      initialState,
    }));

    qb.setState((prev) => ({ ...prev, activeQueryId: "new-id" }));

    const expectedState: QueryBuilderState = {
      activeQueryId: "new-id",
      queries: defaultProps.state.queries,
      selectedQueryIndexes: [],
    };

    expect(state).toStrictEqual(expectedState);
    qb.reset();
    expect(state).toBe(initialState);
  });

  it("should return the list of queries", () => {
    expect(qb.getQueries().length).toBe(2);
    expect(qb.getRawQueries().length).toBe(2);
  });

  it("should return the associated query by id", () => {
    const foundQuery = qb.getQueryById("1");

    expect(foundQuery).toBeDefined();
    expect(foundQuery?.id).toBe("1");
  });

  it("should return null if a query by id is not found", () => {
    const foundQuery = qb.getQueryById("undefined-query-id");

    expect(foundQuery).toBeNull();
  });

  it("should return the correct active query", () => {
    const activeQuery = qb.getActiveQuery();

    expect(activeQuery?.id).toBe(defaultProps.state.activeQueryId);
  });

  it("should currectly change the active query", () => {
    qb.setActiveQuery("2");
    expect(state.activeQueryId).toBe("2");

    qb.setActiveQuery("1");
    expect(state.activeQueryId).toBe("1");
  });

  it("should return the correct query index", () => {
    const qb = createQueryBuilder(defaultProps);
    expect(qb.getQueryIndexById("1")).toBe(0);
  });

  it("should create a new query", () => {
    const newQuery: Omit<ISyntheticSqon, "id"> = {
      op: BooleanOperators.and,
      content: [],
    };

    expect(qb.getQueryById("3")).toBeNull();
    expect(state.queries.length).toBe(2);

    const createdQueryId = qb.createQuery({
      ...newQuery,
      op: newQuery.op as BooleanOperators,
    });

    expect(state.queries.length).toBe(3);
    expect(state.queries.find((q) => q.id === createdQueryId)).toBeDefined();
    expect(mockOnQueryCreate).toHaveBeenCalledTimes(1);

    const expectedOnCreatedHaveBeenCalledWith: ISyntheticSqon = {
      id: createdQueryId,
      ...newQuery,
    };

    expect(mockOnQueryCreate).toHaveBeenCalledWith(
      expectedOnCreatedHaveBeenCalledWith
    );

    expect(mockOnStateChange).toHaveBeenCalledTimes(1);
    expect(mockOnStateChange).toHaveBeenCalledWith(state);
  });

  it("should update a query", () => {
    const updatePayload: Omit<ISyntheticSqon, "id"> = {
      op: "or",
      content: [
        {
          content: {
            value: ["new-field-value"],
            field: "new-field",
          },
          op: "in",
        },
      ],
    };

    expect(state.queries.length).toBe(2);

    qb.setActiveQuery("1");
    qb.updateQuery("1", updatePayload);

    const { id, ...rest } = state.queries.find((q) => q.id === "1")!;

    expect(state.queries.length).toBe(2);
    expect(JSON.stringify(rest)).toStrictEqual(JSON.stringify(updatePayload));
    expect(mockOnQueryUpdate).toHaveBeenCalledTimes(1);

    const expectedHaveBeenCalledWith: ISyntheticSqon = {
      id: "1",
      ...updatePayload,
    };

    expect(mockOnQueryUpdate).toHaveBeenCalledWith(
      "1",
      expectedHaveBeenCalledWith
    );
  });

  it("should remove query when trying to update with empty synthetic sqon and queries.length > 1", () => {
    const updatePayload: Omit<ISyntheticSqon, "id"> = {
      op: "or",
      content: [],
    };

    expect(state.queries.length).toBe(2);

    qb.updateQuery("1", updatePayload);

    expect(state.activeQueryId).toBe("2");
    expect(state.queries.length).toBe(1);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
  });

  it("should not remove query when trying to update with empty synthetic sqon and queries.length === 1", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
        ],
        selectedQueryIndexes: [],
      },
    }));

    const updatePayload: Omit<ISyntheticSqon, "id"> = {
      op: "or",
      content: [],
    };

    expect(qb.coreProps.state.queries.length).toBe(1);

    qb.updateQuery("1", updatePayload);

    expect(state.activeQueryId).toBe("1");
    expect(state.queries.length).toBe(1);
    expect(state.queries.find((q) => q.id === "1")).toBeDefined();
    expect(isEmptySqon(state.queries.find((q) => q.id === "1")!)).toBeTruthy();
  });

  it("should duplicate query", () => {
    expect(state.queries.length).toBe(2);

    qb.duplicateQuery("1");

    expect(state.activeQueryId).toBe(mockUUID);

    const duplicatedQueryFrom = state.queries.find(({ id }) => id === "1");
    const duplicatedQuery = state.queries.find(({ id }) => id === mockUUID);

    expect(JSON.stringify(duplicatedQuery?.content)).toBe(
      JSON.stringify(duplicatedQueryFrom?.content)
    );
    expect(JSON.stringify(duplicatedQuery?.op)).toBe(
      JSON.stringify(duplicatedQueryFrom?.op)
    );
    expect(state.queries.length).toBe(3);
    expect(mockOnQueryCreate).toHaveBeenCalledTimes(1);

    const expectedHaveBeenCalledWith: ISyntheticSqon = {
      ...duplicatedQueryFrom!,
      id: mockUUID,
    };

    expect(mockOnQueryCreate).toHaveBeenCalledWith(expectedHaveBeenCalledWith);
    expect(mockOnStateChange).toHaveBeenCalledTimes(1);
    expect(mockOnStateChange).toHaveBeenCalledWith(state);
  });

  it("should reset queries", () => {
    expect(state.activeQueryId).toBe("1");
    expect(state.queries.length).toBe(2);

    qb.resetQueries("1");

    expect(state.activeQueryId).toBe("1");
    expect(state.queries.length).toBe(1);
    expect(JSON.stringify(state.queries[0])).toBe(
      JSON.stringify(getDefaultSyntheticSqon("1"))
    );
    expect(mockOnStateChange).toHaveBeenCalledTimes(1);
    expect(mockOnStateChange).toHaveBeenCalledWith(state);
  });

  it("should have queries", () => {
    expect(qb.hasQueries()).toBeTruthy();
  });

  it("should not have queries", () => {
    const qb = createQueryBuilder({
      ...defaultProps,
      state: {
        activeQueryId: "1",
        queries: [],
        selectedQueryIndexes: [],
      },
    });

    expect(qb.hasQueries()).toBeFalsy();
  });

  it("should be able to combine", () => {
    expect(qb.coreProps.state.queries.length).toBe(2);
    expect(qb.canCombine()).toBeTruthy();
  });

  it("should not be able to combine", () => {
    const qb = createQueryBuilder({
      ...defaultProps,
      state: {
        activeQueryId: "1",
        queries: [defaultProps.state.queries[0]],
        selectedQueryIndexes: [],
      },
    });

    expect(qb.coreProps.state.queries.length).toBe(1);
    expect(qb.canCombine()).toBeFalsy();
  });

  it("should set raw queries", () => {
    const newRawQueries = [
      {
        id: "3",
        op: "and",
        content: [
          {
            content: {
              value: ["something-else"],
              field: "field3",
            },
            op: "in",
          },
        ],
      },
    ];

    expect(state.queries.length).toBe(2);

    qb.setRawQueries("3", newRawQueries);

    expect(state.queries.length).toBe(1);
    expect(state.activeQueryId).toBe("3");
    expect(mockOnStateChange).toHaveBeenCalledTimes(1);

    const expectedHaveBeenCalledWith: QueryBuilderState = {
      activeQueryId: "3",
      queries: newRawQueries,
      selectedQueryIndexes: [],
    };

    expect(mockOnStateChange).toHaveBeenCalledWith(expectedHaveBeenCalledWith);
  });

  it("should add query to selection list", () => {
    expect(state.selectedQueryIndexes.length).toBe(0);

    qb.selectQuery("1");

    expect(state.selectedQueryIndexes.length).toBe(1);
    expect(state.selectedQueryIndexes[0]).toBe(0);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([0]);
  });

  it("should remove query from selection list", () => {
    expect(state.selectedQueryIndexes.length).toBe(0);

    qb.selectQuery("1");

    expect(state.selectedQueryIndexes.length).toBe(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([0]);

    qb.unselectQuery("1");

    expect(state.selectedQueryIndexes.length).toBe(0);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(2);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([]);
  });

  it("should reset selection list", () => {
    expect(state.selectedQueryIndexes.length).toBe(0);

    qb.selectQuery("1");

    expect(state.selectedQueryIndexes.length).toBe(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([0]);

    qb.resetQuerySelection();

    expect(state.selectedQueryIndexes.length).toBe(0);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(2);
  });

  it("should return selected query indexes", () => {
    expect(qb.getSelectedQueryIndexes()).toEqual([]);
    qb.selectQuery("1");
    expect(state.selectedQueryIndexes).toEqual([0]);
  });

  it("should delete query", () => {
    expect(state.queries.length).toBe(2);

    qb.deleteQuery("1");

    expect(state.queries.length).toBe(1);
    expect(state.activeQueryId).toBe("2");
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
    expect(mockOnQueryDelete).toHaveBeenCalledTimes(1);
    expect(mockOnQueryDelete).toHaveBeenCalledWith("1");
  });

  it("should delete query and reset when initial queries list.length = 1", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
        ],
        selectedQueryIndexes: [],
      },
    }));

    expect(qb.coreProps.state.queries.length).toBe(1);

    qb.deleteQuery("1");

    expect(state.activeQueryId).toBe("1");
    expect(state.queries.length).toBe(1);
    expect(state.queries.find((q) => q.id === "1")).toBeDefined();
    expect(isEmptySqon(state.queries.find((q) => q.id === "1")!)).toBeTruthy();
  });

  it("should delete query and set next when initial queries list.length > 1", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
                  value: ["something2"],
                  field: "field2",
                },
                op: "in",
              },
            ],
          },
        ],
        selectedQueryIndexes: [],
      },
    }));

    expect(qb.coreProps.state.queries.length).toBe(2);

    qb.deleteQuery("1");

    expect(state.activeQueryId).toBe("2");
    expect(state.queries.length).toBe(1);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
  });

  it("should delete query, set next and remove from selectedQueryIndexes list when initial queries list.length > 1", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
                  value: ["something2"],
                  field: "field2",
                },
                op: "in",
              },
            ],
          },
        ],
        selectedQueryIndexes: [0],
      },
    }));

    expect(qb.coreProps.state.queries.length).toBe(2);
    expect(qb.coreProps.state.selectedQueryIndexes.length).toBe(1);
    expect(qb.coreProps.state.selectedQueryIndexes[0]).toBe(0);

    qb.deleteQuery("1");

    expect(state.activeQueryId).toBe("2");
    expect(state.queries.length).toBe(1);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
    expect(state.selectedQueryIndexes).toEqual([]);
  });

  it("should delete query, set next and update selectedQueryIndexes list when initial queries list.length > 1 and selectedIndexes.length > 1", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
                  value: ["something2"],
                  field: "field2",
                },
                op: "in",
              },
            ],
          },
          {
            id: "3",
            op: "and",
            content: [
              {
                content: {
                  value: ["something3"],
                  field: "field3",
                },
                op: "in",
              },
            ],
          },
        ],
        selectedQueryIndexes: [0, 1, 2],
      },
    }));

    expect(qb.coreProps.state.queries.length).toBe(3);
    expect(qb.coreProps.state.selectedQueryIndexes.length).toBe(3);
    expect(qb.coreProps.state.selectedQueryIndexes).toEqual([0, 1, 2]);

    qb.deleteQuery("1");

    expect(state.activeQueryId).toBe("2");
    expect(state.queries.length).toBe(2);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
    expect(state.selectedQueryIndexes).toEqual([0, 1]);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([0, 1]);
  });

  it("should create a new queries with both indexes when combining", () => {
    expect(state.queries.length).toBe(2);

    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
        ],
        selectedQueryIndexes: [0, 1],
      },
    }));

    qb.combineSelectedQueries(BooleanOperators.and);

    expect(state.selectedQueryIndexes.length).toBe(0);
    expect(state.queries.length).toBe(3);
    expect(state.activeQueryId).toBe(mockUUID);
    expect(state.queries.find((q) => q.id === mockUUID)).toBeDefined();
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([]);
    expect(mockOnQueryCreate).toHaveBeenCalledTimes(1);
    expect(mockOnQueryCreate).toHaveBeenCalledWith({
      id: mockUUID,
      op: BooleanOperators.and,
      content: [0, 1],
    });
  });

  it("should update combined queries when deleting a query include in the combined query", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
          {
            id: "3",
            op: "and",
            content: [0, 1],
          },
        ],
        selectedQueryIndexes: [],
      },
    }));

    qb.deleteQuery("1");

    expect(state.queries.length).toBe(2);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
    expect(state.queries.find((q) => q.id === "3")).toBeDefined();
    expect(state.queries.find((q) => q.id === "3")?.content).toEqual([0]);
  });

  it("should delete combined queries when deleting all queries included in the combined query", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
            content: [0],
          },
        ],
        selectedQueryIndexes: [],
      },
    }));

    qb.deleteQuery("1");

    expect(state.queries.length).toBe(1);
    expect(state.activeQueryId).toBe("1");
    expect(state.queries.find((q) => q.id === "1")).toBeDefined();
    expect(state.queries.find((q) => q.id === "1")?.content).toEqual([]);
    expect(state.queries.find((q) => q.id === "2")).toBeUndefined();
  });

  it("should recursively update combined queries when deleting a query included in the combined query", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
                  value: ["something"],
                  field: "field2",
                },
                op: "in",
              },
            ],
          },
          {
            id: "3",
            op: "and",
            content: [0, 1],
          },
          {
            id: "4",
            op: "and",
            content: [0, 1, 2],
          },
        ],
        selectedQueryIndexes: [],
      },
    }));

    expect(qb.coreProps.state.queries.length).toBe(4);

    qb.deleteQuery("1");

    expect(state.queries.length).toBe(3);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
    expect(state.queries.find((q) => q.id === "2")).toBeDefined();
    expect(state.queries.find((q) => q.id === "3")).toBeDefined();
    expect(state.queries.find((q) => q.id === "4")).toBeDefined();
    expect(state.queries.find((q) => q.id === "3")?.content).toEqual([0]);
    expect(state.queries.find((q) => q.id === "4")?.content).toEqual([0, 1]);
  });

  it("should recursively delete combined queries when deleting a query included in the combined query", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
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
                  value: ["something"],
                  field: "field2",
                },
                op: "in",
              },
            ],
          },
          {
            id: "3",
            op: "and",
            content: [0],
          },
          {
            id: "4",
            op: "and",
            content: [0],
          },
          {
            id: "5",
            op: "and",
            content: [0, 1, 2],
          },
        ],
        selectedQueryIndexes: [],
      },
    }));

    expect(qb.coreProps.state.queries.length).toBe(5);

    qb.deleteQuery("1");

    expect(state.queries.length).toBe(2);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
    expect(state.queries.find((q) => q.id === "2")).toBeDefined();
    expect(state.queries.find((q) => q.id === "3")).toBeUndefined();
    expect(state.queries.find((q) => q.id === "4")).toBeUndefined();
    expect(state.queries.find((q) => q.id === "5")).toBeDefined();
    expect(state.queries.find((q) => q.id === "5")?.content).toEqual([0]);
  });

  it("should change combine operator recursively", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "1",
        queries: [
          {
            id: "1",
            op: "and",
            content: [
              {
                content: [
                  {
                    content: {
                      value: ["something"],
                      field: "field2",
                    },
                    op: "in",
                  },
                ],
                op: "and",
              },
            ],
          },
        ],
        selectedQueryIndexes: [],
      },
    }));

    qb.changeCombineOperator("1", BooleanOperators.or);

    expect(state.queries.find((q) => q.id === "1")?.op).toBe(
      BooleanOperators.or
    );

    const subSqon = state.queries.find((q) => q.id === "1")
      ?.content[0] as ISyntheticSqon;

    expect(subSqon.op).toBe(BooleanOperators.or);
    expect(mockOnStateChange).toHaveBeenCalledTimes(1);
    expect(mockOnStateChange).toHaveBeenCalledWith({
      activeQueryId: "1",
      queries: [
        {
          content: [
            {
              content: [
                {
                  content: { field: "field2", value: ["something"] },
                  op: "in",
                },
              ],
              op: "or",
            },
          ],
          id: "1",
          op: "or",
        },
      ],
      selectedQueryIndexes: [],
    });
  });
});
