import { FilterList } from "@/components/feature/QueryFilters/FilterList";

function SidenavFilters() {
  const fields = [
    "chromosome",
    "filter",
    "zygosity",
    "impact_score",
    "variant_class",
    "symbol",
    //"seq_id",
    // "locus_id",
    //"genotype_quality",
    // "pf",
    // "af",
    // "gnomad_v3_af",
    //"hgvsg",
    // "ad_ratio",
    // "vep_impact",
    // "mane_select",
    // "canonical",
  ];

  return (
    <aside>
      <FilterList fields={fields} />
    </aside>
  );
}

export default SidenavFilters;
