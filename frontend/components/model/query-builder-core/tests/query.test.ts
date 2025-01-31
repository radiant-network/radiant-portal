import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import {
  CoreQueryBuilderProps,
  createQueryBuilder,
  QueryBuilderInstance,
  QueryBuilderState,
} from "../query-builder";
import { BooleanOperators, ISyntheticSqon } from "../../sqon";
import { isEmptySqon } from "../utils/sqon";

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
    ],
    selectedQueryIndexes: [],
  },
};

const mockUUID = "abababab-abab-4bab-abab-abababababab";

let qb: QueryBuilderInstance;
let state: QueryBuilderState = defaultProps.state;

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
    qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: (newState) => {
        state = newState;
      },
    });
  });

  it("should return the query id", () => {
    expect(qb.getQueryById("1")?.id).toBe("1");
  });

  it("should be empty", () => {
    qb.createQuery({
      id: "new-query",
      op: BooleanOperators.and,
      content: [],
    });

    expect(isEmptySqon(state.queries.find((q) => q.id === "new-query")!)).toBe(
      true
    );
  });

  it("should not be empty", () => {
    expect(qb.getQueryById("2")?.isEmpty()).toBe(false);
  });

  it("should return the raw query", () => {
    expect(qb.getQueryById("2")?.raw()).toStrictEqual(
      defaultProps.state.queries.find((q) => q.id === "2")
    );
  });

  it("should delete the query", () => {
    // TODO: Implement deleteQuery
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

    qb.getQueryById("2")?.update(newSqon);

    expect(state.queries.find((q) => q.id === "2")).toStrictEqual({
      id: "2",
      ...newSqon,
    });
  });

  it("should duplicate the query", () => {
    expect(state.queries.length).toBe(3);

    qb.getQueryById("3")?.duplicate();

    expect(state.queries.length).toBe(4);
    expect(state.queries.find((q) => q.id === mockUUID)).toStrictEqual({
      ...qb.getQueryById("3")?.raw(),
      id: mockUUID,
    });
  });

  it("should set query as active", () => {
    expect(state.activeQueryId).toBe(defaultProps.state.activeQueryId);

    qb.getQueryById("3")?.setAsActive();

    expect(state.activeQueryId).toBe("3");
  });

  it("should select query", () => {
    expect(state.selectedQueryIndexes.length).toBe(0);

    qb.getQueryById("1")?.select();

    expect(state.selectedQueryIndexes.length).toBe(1);
  });

  it("should unselect query", () => {
    qb.getQueryById("1")?.select();

    expect(state.selectedQueryIndexes.length).toBe(1);

    qb.getQueryById("1")?.unselect();

    expect(state.selectedQueryIndexes.length).toBe(0);
  });

  it("should return the query index", () => {
    expect(qb.getQueryById("1")?.index()).toBe(0);
    expect(qb.getQueryById("2")?.index()).toBe(1);
    expect(qb.getQueryById("3")?.index()).toBe(2);
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
      },
    }));

    qb.getQueryById("1")?.changeCombineOperator(BooleanOperators.or);

    expect(state.queries.find((q) => q.id === "1")?.op).toBe("or");

    const subSqon = state.queries.find((q) => q.id === "1")
      ?.content[0] as ISyntheticSqon;

    expect(subSqon.op).toBe(BooleanOperators.or);
  });
});
