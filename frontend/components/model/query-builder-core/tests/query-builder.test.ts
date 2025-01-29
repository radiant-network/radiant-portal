import { beforeEach, describe, expect, it, jest, test } from "@jest/globals";
import type { Mock } from "jest-mock";
import { createQueryBuilder, CoreQueryBuilderProps } from "../query-builder";

let defaultProps: CoreQueryBuilderProps = {
  id: "test-query-builder",
  state: {
    activeQueryId: "test-id",
    queries: [],
  },
};

let mockOnStateChange: Mock<void, [any]>;
let mockOnQueryCreate: Mock<void, [any]>;
let mockOnQueryUpdate: Mock<void, [any]>;
let mockOnQueryDelete: Mock<void, [any]>;
let mockOnFilterCreate: Mock<void, [any]>;
let mockOnFilterUpdate: Mock<void, [any]>;
let mockOnFilterDelete: Mock<void, [any]>;
let mockOnFilterSave: Mock<void, [any]>;

describe("QueryBuilder Core", () => {
  beforeEach(() => {
    mockOnStateChange = jest.fn();
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
});

describe("Query Manipulation", () => {
  beforeEach(() => {
    mockOnQueryCreate = jest.fn();
    mockOnQueryUpdate = jest.fn();
    mockOnQueryDelete = jest.fn();
    defaultProps.onQueryCreate = mockOnQueryCreate;
    defaultProps.onQueryUpdate = mockOnQueryUpdate;
    defaultProps.onQueryDelete = mockOnQueryDelete;
  });

  it("should", () => {
    expect(true).toBe(true);
  });
});

describe("SavedFilters Manipulation", () => {
  beforeEach(() => {
    mockOnFilterCreate = jest.fn();
    mockOnFilterUpdate = jest.fn();
    mockOnFilterDelete = jest.fn();
    mockOnFilterSave = jest.fn();
    defaultProps.onFilterCreate = mockOnFilterCreate;
    defaultProps.onFilterUpdate = mockOnFilterUpdate;
    defaultProps.onFilterSave = mockOnFilterDelete;
    defaultProps.onFilterDelete = mockOnFilterSave;
  });

  it("should", () => {
    expect(true).toBe(true);
  });
});
