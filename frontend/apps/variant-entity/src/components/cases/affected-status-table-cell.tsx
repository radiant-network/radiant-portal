import {useI18n} from '@/components/hooks/i18n';

interface AffectedStatusTableCell {
    affectedStatus?: string;
}

function AffectedStatusTableCell({affectedStatus}: AffectedStatusTableCell) {
    const {t} = useI18n();
    if (!affectedStatus) {
        return <div>-</div>;
    }

    return (
        <div>
            {t(`variantEntity.cases.affected_status.${affectedStatus}`)}
        </div>
    );
}

export default AffectedStatusTableCell;
