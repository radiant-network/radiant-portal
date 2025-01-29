import { beforeEach, describe, expect, it, jest, test } from "@jest/globals";
import type { Mock } from "jest-mock";
import { CoreQueryBuilderProps } from "../query-builder";

let defaultProps: CoreQueryBuilderProps = {
  id: "test-query-builder",
  state: {
    activeQueryId: "test-id",
    queries: [],
  },
};

let mockOnFilterCreate: Mock<void, [any]>;
let mockOnFilterUpdate: Mock<void, [any]>;
let mockOnFilterDelete: Mock<void, [any]>;
let mockOnFilterSave: Mock<void, [any]>;

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
