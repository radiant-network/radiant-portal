import { createColumnHelper } from "@tanstack/react-table";
import {
  TableColumnDef,
  createColumnSettings,
} from "@/components/base/Table/Table";
import {
  getTableRowSelectionCell,
  getTableRowSelectionHeader,
} from "@/components/base/Table/TableRowSelection";
import { getTableRowExpandCell } from "@/components/base/Table/TableRowExpand";
import { Occurrence } from "@/api/api";

const columnHelper = createColumnHelper<Occurrence>();

const columns = [
  {
    id: "row_selection",
    header: getTableRowSelectionHeader,
    cell: getTableRowSelectionCell,
    size: 32,
    minSize: 24,
  },
  {
    id: "row_expand",
    cell: getTableRowExpandCell,
    size: 32,
    minSize: 24,
  },
  columnHelper.accessor((row) => row.hgvsg, {
    id: "hgvsg",
    cell: (info) => info.getValue(),
    header: "Variant",
    size: 100,
    minSize: 50,
  }),
  columnHelper.accessor((row) => row.variant_class, {
    id: "variant_class",
    cell: (info) => <i>{info.getValue()}</i>,
    header: "Type",
    size: 300,
  }),
] as TableColumnDef<Occurrence, any>[];

const userSettings = createColumnSettings([
  {
    id: "row_selection",
    visible: true,
  },
  {
    id: "row_expand",
    visible: true,
  },
  {
    id: "hgvsg",
    visible: true,
  },
  {
    id: "variant_class",
    visible: true,
  },
]);

const defaultSettings = createColumnSettings([
  {
    id: "row_selection",
    visible: true,
    fixed: true,
  },
  {
    id: "row_expand",
    visible: true,
    fixed: true,
  },
  {
    id: "hgvsg",
    visible: true,
    fixed: true,
  },
  {
    id: "variant_class",
    visible: true,
  },
]);

export { columns, userSettings, defaultSettings };
