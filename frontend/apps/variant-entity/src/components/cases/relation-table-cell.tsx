interface RelationTableCell {
    relationshipToProband?: string;
}

function RelationTableCell({relationshipToProband}: RelationTableCell) {

    if (!relationshipToProband) {
        return <span>-</span>;
    }

    return (
        <span>
            { relationshipToProband.charAt(0).toUpperCase() + relationshipToProband.slice(1)}
        </span>
    );
}

export default RelationTableCell;
