import EmptyCell from "@/components/base/data-table/cells/empty-cell";
import AnchorLink from "@/components/base/navigation/anchor-link";

type DbSNPCellProps = {
  rsnumber?: string;
};
function DbSNPCell({ rsnumber }: DbSNPCellProps) {
  if (!rsnumber) return <EmptyCell />;
  return (
    <AnchorLink size="sm" href={`https://www.ncbi.nlm.nih.gov/snp/${rsnumber}`} target="_blank" external />
  );
};
export default DbSNPCell;
