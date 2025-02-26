import { FilterList } from "@/components/feature/QueryFilters/FilterList";
import { useConfig } from "@/components/model/applications-config";

function SidenavFilters() {
  const config = useConfig(); 
  return (
    <aside>
      <FilterList fields={config.variant_entity.aggregations} />
    </aside>
  );
}

export default SidenavFilters;
