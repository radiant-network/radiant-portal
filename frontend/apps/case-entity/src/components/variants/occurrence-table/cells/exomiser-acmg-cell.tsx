import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';

type ExomiserAcmgCellProps = {
    code?: string;
};

function ExomiserAcmgCell({code}: ExomiserAcmgCellProps) {
    if (!code) return <EmptyCell/>;

    return (
        <div className="flex gap-1">
            <ClinVarBadge key={code} value={code} abbreviated/>
        </div>
    );
}

export default ExomiserAcmgCell;
