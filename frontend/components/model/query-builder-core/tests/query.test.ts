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
    mockOnQueryCreate = jest.fn();
    mockOnQueryUpdate = jest.fn();
    mockOnQueryDelete = jest.fn();
    mockOnStateChange = jest.fn();
    defaultProps.onQueryCreate = mockOnQueryCreate;
    defaultProps.onQueryUpdate = mockOnQueryUpdate;
    defaultProps.onQueryDelete = mockOnQueryDelete;
  });

  it("should", () => {
    expect(true).toBe(true);
  });
});
