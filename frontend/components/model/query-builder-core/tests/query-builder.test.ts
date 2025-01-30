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
} from "../query-builder";
import { ISyntheticSqon } from "../../sqon";
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
  },
};

let mockOnQueryCreate: Mock<void, [any]>;
let mockOnQueryUpdate: Mock<void, [any]>;
let mockOnQueryDelete: Mock<void, [any]>;
let mockOnStateChange: Mock<void, [any]>;

const mockUUID = "abababab-abab-4bab-abab-abababababab";

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
    defaultProps.onQueryCreate = mockOnQueryCreate;
    defaultProps.onQueryUpdate = mockOnQueryUpdate;
    defaultProps.onQueryDelete = mockOnQueryDelete;
    defaultProps.onStateChange = mockOnStateChange;
  });

  it("should initialize with provided state", () => {
    const qb = createQueryBuilder(defaultProps);
    expect(qb.coreProps.state).toEqual(defaultProps.state);
  });

  it("should update state when setCoreProps is called", () => {
    const qb = createQueryBuilder(defaultProps);

    qb.setCoreProps((prev) => ({
      ...prev,
      state: { ...prev.state, activeQueryId: "new-id" },
    }));

    expect(qb.coreProps.state.activeQueryId).toBe("new-id");
  });

  it("should update state and trigger onStateChange", () => {
    const qb = createQueryBuilder(defaultProps);

    qb.setState((prev) => ({ ...prev, activeQueryId: "new-id" }));

    expect(mockOnStateChange).toHaveBeenCalledTimes(1);

    const expectedHaveBeenCalledWith: QueryBuilderState = {
      ...defaultProps.state,
      activeQueryId: "new-id",
    };

    expect(mockOnStateChange).toHaveBeenCalledWith(expectedHaveBeenCalledWith);
  });

  it("should correctly reset the state to the initial state", () => {
    let state = defaultProps.state;
    const initialState = {
      activeQueryId: "initial-query-id",
      queries: [],
    };

    const qb = createQueryBuilder({
      ...defaultProps,
      initialState,
      onStateChange: (newState) => {
        state = newState;
      },
    });

    qb.setState((prev) => ({ ...prev, activeQueryId: "new-id" }));
    expect(state).toStrictEqual({
      activeQueryId: "new-id",
      queries: defaultProps.state.queries,
    });
    qb.reset();
    expect(state).toBe(initialState);
  });

  it("should return the list of queries", () => {
    const qb = createQueryBuilder(defaultProps);

    expect(qb.getQueries().length).toBe(2);
    expect(qb.getRawQueries().length).toBe(2);
  });

  it("should return the associated query by id", () => {
    const qb = createQueryBuilder(defaultProps);
    const foundQuery = qb.getQueryById("1");

    expect(foundQuery).toBeDefined();
    expect(foundQuery?.id).toBe("1");
  });

  it("should return null if a query by id is not found", () => {
    const qb = createQueryBuilder(defaultProps);
    const foundQuery = qb.getQueryById("undefined-query-id");

    expect(foundQuery).toBeNull();
  });

  it("should return the correct active query", () => {
    const qb = createQueryBuilder(defaultProps);
    const activeQuery = qb.getActiveQuery();

    expect(activeQuery?.id).toBe(defaultProps.state.activeQueryId);
  });

  it("should currectly change the active query", () => {
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
      },
    });

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
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
        mockOnStateChange(newState);
      },
    });

    const newQuery = {
      op: "and",
      content: [],
    };

    expect(qb.getQueryById("3")).toBeNull();
    expect(state.queries.length).toBe(2);

    const createdQueryId = qb.createQuery(newQuery);

    expect(qb.getQueryById(createdQueryId)).toBeDefined();
    expect(state.queries.length).toBe(3);
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
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
      },
    });

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
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
      },
    });

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
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      id: defaultProps.id,
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
      },
      onStateChange: (newState) => {
        state = newState;
      },
    });

    const updatePayload: Omit<ISyntheticSqon, "id"> = {
      op: "or",
      content: [],
    };

    expect(state.queries.length).toBe(2);

    qb.updateQuery("1", updatePayload);

    expect(state.activeQueryId).toBe("1");
    expect(state.queries.length).toBe(1);
    expect(state.queries.find((q) => q.id === "1")).toBeDefined();
    expect(isEmptySqon(state.queries.find((q) => q.id === "1")!)).toBeTruthy();
  });

  it("should duplicate query", () => {
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
        mockOnStateChange(newState);
      },
      onQueryCreate: mockOnQueryCreate,
    });

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
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
        mockOnStateChange(newState);
      },
    });

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
    const qb = createQueryBuilder(defaultProps);

    expect(qb.hasQueries()).toBeTruthy();
  });

  it("should not have queries", () => {
    const qb = createQueryBuilder({
      ...defaultProps,
      state: {
        activeQueryId: "1",
        queries: [],
      },
    });

    expect(qb.hasQueries()).toBeFalsy();
  });

  it("should be able to combine", () => {
    const qb = createQueryBuilder(defaultProps);

    expect(qb.coreProps.state.queries.length).toBe(2);
    expect(qb.canCombine()).toBeTruthy();
  });

  it("should not be able to combine", () => {
    const qb = createQueryBuilder({
      ...defaultProps,
      state: {
        activeQueryId: "1",
        queries: [defaultProps.state.queries[0]],
      },
    });

    expect(qb.coreProps.state.queries.length).toBe(1);
    expect(qb.canCombine()).toBeFalsy();
  });

  it("should set raw queries", () => {
    let state = defaultProps.state;

    const qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        mockOnStateChange(newState);
        state = newState;
      },
    });

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
    };

    expect(mockOnStateChange).toHaveBeenCalledWith(expectedHaveBeenCalledWith);
  });
});
