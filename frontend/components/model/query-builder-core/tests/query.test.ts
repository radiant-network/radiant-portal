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

let mockOnQueryCreate: Mock<void, [any]>;
let mockOnQueryUpdate: Mock<void, [any]>;
let mockOnQueryDelete: Mock<void, [any]>;

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
