import { createColumnHelper, HeaderContext } from "@tanstack/react-table";
import { IVariantEntity } from "./variant_type";
import ExternalLinkCell from "@/components/base/ui/table/cells/externalLinkCell";
import GeneCell from "@/components/base/ui/table/cells/geneCell";
import {
  TableColumnDef,
  createColumnSettings,
} from "@/components/base/ui/table/table";
import {
  getTableRowSelectionCell,
  getTableRowSelectionHeader,
} from "@/components/base/ui/table/tableRowSelection";
import { getTableRowExpandCell } from "@/components/base/ui/table/tableRowExpand";

const columnHelper = createColumnHelper<IVariantEntity>();

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
  columnHelper.accessor((row) => row.rsnumber, {
    id: "rsnumber",
    cell: (info) =>
      info.getValue() ? (
        <ExternalLinkCell
          url={"https://www.ncbi.nlm.nih.gov/snp/${info.getValue()}"}
        />
      ) : (
        "-"
      ),
    header: "dbSNP",
  }),
  columnHelper.accessor((row) => row.genes, {
    id: "genes",
    cell: (info) => (
      <>
        {info.getValue().hits.edges.map((gene) => (
          <GeneCell
            key={gene.node.omim_gene_id}
            url={`https://www.omim.org/entry/${gene.node.omim_gene_id}`}
            name={gene.node.symbol}
            onClick={() => {
              console.log("gene clicked"); //TODO: to remove
            }}
          />
        ))}
      </>
    ),
    header: "Gene",
  }),
] as TableColumnDef<IVariantEntity, any>[];

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
  {
    id: "rsnumber",
    visible: true,
  },
  {
    id: "genes",
    visible: false,
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
  {
    id: "rsnumber",
    visible: true,
  },
  {
    id: "genes",
    visible: false,
  },
]);

export { columns, userSettings, defaultSettings };
