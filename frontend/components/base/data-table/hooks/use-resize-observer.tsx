import { useEffect, useRef } from "react";
import { TableState } from "@tanstack/react-table";

/**
 * observes the state and triggers an event after a resize finishes
 * @src https://github.com/TanStack/table/discussions/2498#discussioncomment-8649218
 */
export function useResizeObserver(
  state: TableState,
  callback: (columnId: string, columnSize: number) => void
) {
  // This Ref will contain the id of the column being resized or undefined
  const columnResizeRef = useRef<string | false>(false);
  useEffect(() => {
    // We are interested in calling the resize event only when "state.columnResizingInfo?.isResizingColumn" changes from
    // a string to false, because it indicates that it WAS resizing but it no longer is.
    if (
      state.columnSizingInfo &&
      !state.columnSizingInfo?.isResizingColumn &&
      columnResizeRef.current
    ) {
      // Trigger resize event
      callback(
        columnResizeRef.current,
        state.columnSizing[columnResizeRef.current]
      );
    }
    columnResizeRef.current = state.columnSizingInfo?.isResizingColumn;
  }, [callback, state.columnSizingInfo, state.columnSizing]);
}
