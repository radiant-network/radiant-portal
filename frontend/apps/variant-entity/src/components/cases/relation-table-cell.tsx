interface RelationTableCell {
    relationshipToProband?: string;
}

function RelationTableCell({relationshipToProband}: RelationTableCell) {

    if (!relationshipToProband) {
        return <div>-</div>;
    }

    return (
        <div>
            { relationshipToProband.charAt(0).toUpperCase() + relationshipToProband.slice(1)}
        </div>
    );
}

export default RelationTableCell;
