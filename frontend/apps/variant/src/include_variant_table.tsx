import { createColumnHelper } from "@tanstack/react-table";
import {
  TableColumnDef,
  createColumnSettings,
} from "@/components/base/data-table/data-table";
import {
  getTableRowSelectionCell,
  getTableRowSelectionHeader,
} from "@/components/base/data-table/data-table-row-selection";
import RowExpandCell from "@/components/base/data-table/cells/row-expand-cell";
import GeneCell from "@/components/base/data-table/cells/gene-cell";
import LinkCell from "@/components/base/data-table/cells/link-cell";
import ManeCell from "@/components/base/data-table/cells/mane-cell";
import OmimCell from "@/components/base/data-table/cells/omim-cell";
import ClinvarCell from "@/components/base/data-table/cells/clinvar-cell";
import NumberCell from "@/components/base/data-table/cells/number-cell";
import VariantClassCell from "@/components/base/data-table/cells/variant-class-cell";
import ZygosityCell from "@/components/base/data-table/cells/zygosity-cell";
import { Occurrence } from "@/api/api";

const columnHelper = createColumnHelper<Occurrence>();

const columns = [
  {
    id: "row_expand",
    cell: RowExpandCell,
    size: 32,
    minSize: 24,
  },
  {
    id: "row_selection",
    header: getTableRowSelectionHeader,
    cell: getTableRowSelectionCell,
    size: 32,
    minSize: 24,
  },
  columnHelper.accessor((row) => row.hgvsg, {
    id: "hgvsg",
    cell: (info) => <LinkCell url="#">{info.getValue()}</LinkCell>,
    header: "Variant",
    size: 100,
    minSize: 50,
  }),
  columnHelper.accessor((row) => row.variant_class, {
    id: "variant_class",
    cell: (info) => <VariantClassCell value={info.getValue()} />,
    header: "Type",
    size: 150,
    minSize: 100,
    maxSize: 200,
  }),
  columnHelper.accessor((row) => row.symbol, {
    id: "symbol",
    cell: (info) => {
      return <GeneCell symbol={info.getValue()} />;
    },
    header: "Gene",
    size: 200,
  }),
  columnHelper.accessor((row) => row.vep_impact, {
    id: "vep_impact",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "VEP",
    size: 200,
  }),
  columnHelper.accessor((row) => row.mane_select, {
    id: "mane_select",
    cell: (info) => {
      return <ManeCell mane_select={info.getValue()} />;
    },
    header: "MANE",
    size: 75,
  }),
  columnHelper.accessor((row) => row.omim_inheritance_code, {
    id: "omim_inheritance_code",
    cell: (info) => {
      return <OmimCell codes={info.getValue()} />;
    },
    header: "OMIM",
    size: 200,
  }),
  columnHelper.accessor((row) => row.clinvar, {
    id: "clinvar",
    cell: (info) => <ClinvarCell codes={info.getValue()} />,
    header: "ClinVar",
  }),
  columnHelper.accessor((row) => row.gnomad_v3_af, {
    id: "gnomad_v3_af",
    cell: (info) => <NumberCell value={info.getValue()} />,
    header: "gnomAD",
    size: 200,
  }),
  columnHelper.accessor((row) => row.pf, {
    id: "pf",
    cell: (info) => <NumberCell value={info.getValue()} />,
    header: "Participant frequency",
    size: 200,
  }),
  columnHelper.accessor((row) => row.genotype_quality, {
    id: "genotype_quality",
    cell: (info) => <NumberCell value={info.getValue()} />,
    header: "Genotype Quality",
    size: 200,
  }),
  columnHelper.accessor((row) => row.zygosity, {
    id: "zygosity",
    cell: (info) => <ZygosityCell value={info.getValue()} />,
    header: "Zygosity",
  }),
  columnHelper.accessor((row) => row.ad_ratio, {
    id: "ad_ratio",
    cell: (info) => <NumberCell value={info.getValue()} />,
    header: "Ad Ratio",
  }),
] as TableColumnDef<Occurrence, any>[];

const defaultSettings = createColumnSettings([
  {
    id: "row_expand",
    visible: true,
    fixed: true,
  },
  {
    id: "row_selection",
    visible: true,
    fixed: true,
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
    id: "symbol",
    visible: true,
  },
  {
    id: "vep_impact",
    visible: true,
  },
  {
    id: "mane_select",
    visible: true,
  },
  {
    id: "omim_inheritance_code",
    visible: true,
  },
  {
    id: "clinvar",
    visible: true,
  },
  {
    id: "gnomad_v3_af",
    visible: true,
  },
  {
    id: "pf",
    visible: true,
  },
  {
    id: "genotype_quality",
    visible: true,
  },
  {
    id: "zygosity",
    visible: true,
  },
  {
    id: "ad_ratio",
    visible: true,
  },
]);

const userSettings = createColumnSettings([
  {
    id: "row_expand",
    visible: true,
  },
  {
    id: "row_selection",
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
    id: "symbol",
    visible: true,
  },
  {
    id: "vep_impact",
    visible: true,
  },
  {
    id: "mane_select",
    visible: true,
  },
  {
    id: "omim_inheritance_code",
    visible: true,
  },
  {
    id: "clinvar",
    visible: true,
  },
  {
    id: "gnomad_v3_af",
    visible: true,
  },
  {
    id: "pf",
    visible: true,
  },
  {
    id: "genotype_quality",
    visible: true,
  },
  {
    id: "zygosity",
    visible: true,
  },
  {
    id: "ad_ratio",
    visible: true,
  },
]);

export { columns, userSettings, defaultSettings };
