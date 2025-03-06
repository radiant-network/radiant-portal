import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { Mock } from "jest-mock";
import { CoreQueryBuilderProps } from "../query-builder";
import {
  ISyntheticSqon,
  MERGE_VALUES_STRATEGIES,
  TermOperators,
} from "../../sqon";
import {
  queryBuilderRemote,
  QueryBuilderRemoteState,
  QueryBuilderUpdateEventType,
} from "../query-builder-remote";

class LocalStorageMock {
  store: Record<string, string>;

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    return Object.keys(this.store)[index];
  }
}

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

let qbId: string = "test-query-builder";
let mockDispatchEvent: Mock<boolean, [Event]>;

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
    mockDispatchEvent = jest.fn();
    // @ts-ignore
    global.window = {
      localStorage: new LocalStorageMock(),
      dispatchEvent: mockDispatchEvent,
    };

    queryBuilderRemote.setLocalQueryBuilderState(qbId, {
      eventType: QueryBuilderUpdateEventType.SET_STATE,
      eventData: defaultProps.state,
      value: defaultProps.state,
    });
  });

  it("should add query", () => {
    const newQuery: ISyntheticSqon = {
      id: mockUUID,
      op: "and",
      content: [
        {
          content: {
            value: ["something"],
            field: "field",
          },
          op: "in",
        },
      ],
    };

    const qbState = queryBuilderRemote.getLocalQueryBuilderState(qbId);
    expect(qbState?.queries).toHaveLength(2);

    queryBuilderRemote.addQuery(qbId, newQuery);

    const qbStateUpdated = queryBuilderRemote.getLocalQueryBuilderState(qbId);

    expect(qbStateUpdated?.queries).toHaveLength(3);
    expect(qbStateUpdated?.queries).toContainEqual(newQuery);
  });

  it("should return the active query", () => {
    const activeQuery = queryBuilderRemote.getActiveQuery(qbId);
    expect(activeQuery).toEqual(defaultQueries[0]);
  });

  it("should update query", () => {
    const queryToUpdate: ISyntheticSqon = {
      id: defaultQueries[0].id,
      op: "and",
      content: [
        {
          content: {
            value: ["new-value"],
            field: "field1",
          },
          op: "in",
        },
      ],
    };

    const qbState = queryBuilderRemote.getLocalQueryBuilderState(qbId);
    expect(qbState?.queries).toHaveLength(2);

    queryBuilderRemote.updateQuery(qbId, queryToUpdate);

    const qbStateUpdated = queryBuilderRemote.getLocalQueryBuilderState(qbId);

    expect(qbStateUpdated?.queries).toHaveLength(2);
    expect(qbStateUpdated?.queries).toContainEqual(queryToUpdate);
  });

  it("should update query when query doesn't exist", () => {
    const queryToUpdate: ISyntheticSqon = {
      id: "unexistent-query-id",
      op: "and",
      content: [
        {
          content: {
            value: ["new-value"],
            field: "field1",
          },
          op: "in",
        },
      ],
    };

    expect(() => queryBuilderRemote.updateQuery(qbId, queryToUpdate)).toThrow(
      Error
    );
  });

  it("should update active query field - MERGE_VALUES_STRATEGIES -> OVERRIDE_VALUES", () => {
    const activeQuery: ISyntheticSqon = {
      id: "active-query-id",
      op: "and",
      content: [
        {
          content: {
            value: ["value"],
            field: "field1",
          },
          op: "in",
        },
      ],
    };

    const newState: QueryBuilderRemoteState = {
      ...defaultProps.state,
      activeQueryId: activeQuery.id,
      queries: [...defaultProps.state.queries, activeQuery],
    };

    queryBuilderRemote.setLocalQueryBuilderState(qbId, {
      eventType: QueryBuilderUpdateEventType.SET_STATE,
      eventData: newState,
      value: newState,
    });

    const updatedQuery: ISyntheticSqon = {
      id: activeQuery.id,
      op: "and",
      content: [
        {
          content: {
            value: ["new-value"],
            field: "field1",
          },
          op: "not-in",
        },
      ],
    };

    queryBuilderRemote.updateActiveQueryField(qbId, {
      field: "field1",
      value: ["new-value"],
      operator: TermOperators.NotIn,
      merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
    });

    const updatedActiveQuery = queryBuilderRemote.getActiveQuery(qbId);

    expect(updatedActiveQuery.content).toHaveLength(1);
    expect(updatedActiveQuery).toEqual(updatedQuery);
  });

  it("should update active query field - MERGE_VALUES_STRATEGIES -> APPEND_VALUES", () => {
    const activeQuery: ISyntheticSqon = {
      id: "active-query-id",
      op: "and",
      content: [
        {
          content: {
            value: ["value"],
            field: "field1",
          },
          op: "in",
        },
      ],
    };

    const newState: QueryBuilderRemoteState = {
      ...defaultProps.state,
      activeQueryId: activeQuery.id,
      queries: [...defaultProps.state.queries, activeQuery],
    };

    queryBuilderRemote.setLocalQueryBuilderState(qbId, {
      eventType: QueryBuilderUpdateEventType.SET_STATE,
      eventData: newState,
      value: newState,
    });

    const updatedQuery: ISyntheticSqon = {
      id: activeQuery.id,
      op: "and",
      content: [
        {
          content: {
            value: ["value", "new-value"],
            field: "field1",
          },
          op: "not-in",
        },
      ],
    };

    queryBuilderRemote.updateActiveQueryField(qbId, {
      field: "field1",
      value: ["new-value"],
      operator: TermOperators.NotIn,
      merge_strategy: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
    });

    const updatedActiveQuery = queryBuilderRemote.getActiveQuery(qbId);

    expect(updatedActiveQuery.content).toHaveLength(1);
    expect(updatedActiveQuery).toEqual(updatedQuery);
  });

  it("should update active query field - Recurive - MERGE_VALUES_STRATEGIES -> APPEND_VALUES", () => {
    const activeQuery: ISyntheticSqon = {
      id: "active-query-id",
      op: "and",
      content: [
        {
          content: [
            {
              content: {
                value: ["value"],
                field: "field1",
              },
              op: "in",
            },
          ],
          op: "and",
        },
      ],
    };

    const newState: QueryBuilderRemoteState = {
      ...defaultProps.state,
      activeQueryId: activeQuery.id,
      queries: [...defaultProps.state.queries, activeQuery],
    };

    queryBuilderRemote.setLocalQueryBuilderState(qbId, {
      eventType: QueryBuilderUpdateEventType.SET_STATE,
      eventData: newState,
      value: newState,
    });

    const updatedQuery: ISyntheticSqon = {
      id: activeQuery.id,
      op: "and",
      content: [
        {
          content: [
            {
              content: {
                value: ["value", "new-value"],
                field: "field1",
              },
              op: "not-in",
            },
          ],
          op: "and",
        },
      ],
    };

    queryBuilderRemote.updateActiveQueryField(qbId, {
      field: "field1",
      value: ["new-value"],
      operator: TermOperators.NotIn,
      merge_strategy: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
    });

    const updatedActiveQuery = queryBuilderRemote.getActiveQuery(qbId);

    expect(updatedActiveQuery.content).toHaveLength(1);
    expect(updatedActiveQuery).toEqual(updatedQuery);
  });

  it("should remove field when value list is empty", () => {
    const activeQuery: ISyntheticSqon = {
      id: "active-query-id",
      op: "and",
      content: [
        {
          content: {
            value: ["value"],
            field: "field1",
          },
          op: "in",
        },
      ],
    };

    const newState: QueryBuilderRemoteState = {
      ...defaultProps.state,
      activeQueryId: activeQuery.id,
      queries: [...defaultProps.state.queries, activeQuery],
    };

    queryBuilderRemote.setLocalQueryBuilderState(qbId, {
      eventType: QueryBuilderUpdateEventType.SET_STATE,
      eventData: newState,
      value: newState,
    });

    const updatedQuery: ISyntheticSqon = {
      id: activeQuery.id,
      op: "and",
      content: [],
    };

    queryBuilderRemote.updateActiveQueryField(qbId, {
      field: "field1",
      value: [],
    });

    const updatedActiveQuery = queryBuilderRemote.getActiveQuery(qbId);

    expect(updatedActiveQuery.content).toHaveLength(0);
    expect(updatedActiveQuery).toEqual(updatedQuery);
  });

  // TOOD test updateQueryByTableFilter
  // TODO test updateActiveQueryFilters
});
