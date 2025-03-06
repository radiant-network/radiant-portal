import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { Mock } from "jest-mock";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  QueryBuilderInstance,
  QueryBuilderState,
} from "../query-builder";
import { BooleanOperators, ISyntheticSqon, IValueQuery } from "../../sqon";
import { isEmptySqon } from "../utils/sqon";

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

let defaultProps: CoreQueryBuilderProps = {
  id: "test-query-builder",
  state: {
    activeQueryId: "1",
    queries: defaultQueries,
    selectedQueryIndexes: [],
    savedFilters: [],
  },
};

const mockUUID = "abababab-abab-4bab-abab-abababababab";

let qb: QueryBuilderInstance;
let state: QueryBuilderState = defaultProps.state;

let mockOnQuerySelectChange: Mock<void, [any]>;
let mockOnActiveQueryChange: Mock<void, [any]>;

describe("Query Manipulation", () => {
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
    mockOnQuerySelectChange = jest.fn();
    mockOnActiveQueryChange = jest.fn();

    qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
      },
      onQuerySelectChange: mockOnQuerySelectChange,
      onActiveQueryChange: mockOnActiveQueryChange,
    });
  });

  it("should return the query id", () => {
    expect(qb.getQuery("1")?.id).toBe("1");
  });

  it("should be empty", () => {
    qb.createQuery({
      id: "new-query",
      op: BooleanOperators.And,
      content: [],
    });

    expect(isEmptySqon(state.queries.find((q) => q.id === "new-query")!)).toBe(
      true
    );
  });

  it("should not be empty", () => {
    expect(qb.getQuery("2")?.isEmpty()).toBe(false);
  });

  it("should return the raw query", () => {
    expect(qb.getQuery("2")?.raw()).toStrictEqual(
      defaultProps.state.queries.find((q) => q.id === "2")
    );
  });

  it("should delete query and keep active query", () => {
    expect(state.activeQueryId).toBe(defaultQueries[0].id);
    expect(state.queries.length).toBe(3);

    qb.getQuery("2")?.delete();

    expect(state.activeQueryId).toBe(defaultQueries[0].id);
    expect(state.queries.length).toBe(2);
    expect(state.queries.find((q) => q.id === "2")).toBeUndefined();
  });

  it("should delete active query and set next query", () => {
    expect(state.activeQueryId).toBe(defaultQueries[0].id);
    expect(state.queries.length).toBe(3);

    qb.getQuery("1")?.delete();

    expect(state.activeQueryId).toBe(defaultQueries[1].id);
    expect(state.queries.length).toBe(2);
    expect(state.queries.find((q) => q.id === "1")).toBeUndefined();
    expect(mockOnActiveQueryChange).toHaveBeenCalledTimes(1);
  });

  it("should update the query", () => {
    const newSqon: Omit<ISyntheticSqon, "id"> = {
      op: "and",
      content: [
        {
          content: {
            value: ["new-value"],
            field: "new-field",
          },
          op: "in",
        },
      ],
    };

    qb.getQuery("2")?.update(newSqon);

    expect(state.queries.find((q) => q.id === "2")).toStrictEqual({
      id: "2",
      ...newSqon,
    });
  });

  it("should duplicate the query", () => {
    expect(state.queries.length).toBe(3);

    qb.getQuery("3")?.duplicate();

    expect(state.queries.length).toBe(4);
    expect(state.queries.find((q) => q.id === mockUUID)).toStrictEqual({
      ...qb.getQuery("3")?.raw(),
      id: mockUUID,
    });
  });

  it("should set query as active", () => {
    expect(state.activeQueryId).toBe(defaultProps.state.activeQueryId);

    const rawQuery = qb.getQuery("3")?.raw();

    qb.getQuery("3")?.setAsActive();

    expect(state.activeQueryId).toBe("3");
    expect(mockOnActiveQueryChange).toHaveBeenCalledTimes(1);
    expect(mockOnActiveQueryChange).toHaveBeenCalledWith(rawQuery);
  });

  it("should select query", () => {
    expect(state.selectedQueryIndexes.length).toBe(0);

    qb.getQuery("1")?.toggleSelect(true);

    expect(state.selectedQueryIndexes.length).toBe(1);
    expect(state.selectedQueryIndexes).toContain(0);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([0]);
  });

  it("should unselect query", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        selectedQueryIndexes: [0],
      },
    }));

    expect(qb.coreProps.state.selectedQueryIndexes.length).toBe(1);

    qb.getQuery("1")?.toggleSelect(false);

    expect(state.selectedQueryIndexes.length).toBe(0);
    expect(mockOnQuerySelectChange).toHaveBeenCalledTimes(1);
    expect(mockOnQuerySelectChange).toHaveBeenCalledWith([]);
  });

  it("should return the query index", () => {
    expect(qb.getQuery("1")?.index()).toBe(0);
    expect(qb.getQuery("2")?.index()).toBe(1);
    expect(qb.getQuery("3")?.index()).toBe(2);
  });

  it("should change combine operator", () => {
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
        savedFilters: [],
      },
    }));

    qb.getQuery("1")?.changeCombineOperator(BooleanOperators.Or);

    expect(state.queries.find((q) => q.id === "1")?.op).toBe("or");

    const subSqon = state.queries.find((q) => q.id === "1")
      ?.content[0] as ISyntheticSqon;

    expect(subSqon.op).toBe(BooleanOperators.Or);
  });

  it("should add pill to the query", () => {
    const pill: IValueQuery = {
      id: "pill-id",
      title: "Pill Title",
      content: [
        {
          content: {
            value: ["pill-value"],
            field: "pill-field",
          },
          op: "in",
        },
      ],
      op: "and",
    };

    expect(
      qb.coreProps.state.queries.find((q) => q.id === "1")?.content
    ).not.toContainEqual(pill);

    qb.getQuery("1")?.addPill(pill);

    expect(state.queries.find((q) => q.id === "1")?.content).toContainEqual(
      pill
    );
  });

  it("should remove pill by id from the query", () => {
    const pill: IValueQuery = {
      id: "pill-id",
      title: "Pill Title",
      content: [
        {
          content: {
            value: ["pill-value"],
            field: "pill-field",
          },
          op: "in",
        },
      ],
      op: "and",
    };

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
              pill,
            ],
          },
        ],
        selectedQueryIndexes: [],
        savedFilters: [],
      },
    }));

    expect(
      qb.coreProps.state.queries.find((q) => q.id === "1")?.content
    ).toContainEqual(pill);

    qb.getQuery("1")?.removePillById("pill-id");

    expect(state.queries.find((q) => q.id === "1")?.content).not.toContainEqual(
      pill
    );
  });

  it("should be selectable", () => {
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
        ],
        selectedQueryIndexes: [],
        savedFilters: [],
      },
    }));

    expect(qb.getQuery("1")?.isSelectable()).toBe(true);
  });

  it("should not be selectable when only 1 query", () => {
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
        savedFilters: [],
      },
    }));

    expect(qb.getQuery("1")?.isSelectable()).toBe(false);
  });

  it("should not be selectable when 2 queries and 1 is empty", () => {
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
            content: [],
          },
        ],
        selectedQueryIndexes: [],
        savedFilters: [],
      },
    }));

    expect(qb.getQuery("1")?.isSelectable()).toBe(false);
  });

  it("should remove pill using field name", () => {
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
        savedFilters: [],
      },
    }));

    qb.getQuery("1")?.removePillByFieldOrIndex("field1");

    expect(state.queries.find((q) => q.id === "1")?.content).toEqual([]);
    expect(mockOnActiveQueryChange).toHaveBeenCalledTimes(1);
  });

  it("should remove pill using ref index", () => {
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
                  field: "field1",
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
        savedFilters: [],
      },
    }));

    qb.getQuery("3")?.removePillByFieldOrIndex(0);

    expect(state.queries.find((q) => q.id === "3")?.content).toEqual([1]);
  });

  it("should be referenced in query valid", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "2",
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
        savedFilters: [],
      },
    }));

    expect(qb.getQuery("1")?.isReferencedInActiveQuery()).toBe(true);
  });

  it("should be referenced in query not valid", () => {
    qb.setCoreProps((prev) => ({
      ...prev,
      state: {
        activeQueryId: "2",
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
            content: [],
          },
          {
            id: "3",
            op: "and",
            content: [0],
          },
        ],
        selectedQueryIndexes: [],
        savedFilters: [],
      },
    }));

    expect(qb.getQuery("2")?.isReferencedInActiveQuery()).toBe(false);
  });
});

// TEST saveAsCustomPill
