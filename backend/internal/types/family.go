package types

type Family struct {
	ID                        int
	CaseID                    int
	Case                      Case `gorm:"foreignKey:ID;references:CaseID"`
	FamilyMemberID            int
	FamilyMember              Patient `gorm:"foreignKey:ID;references:FamilyMemberID"`
	RelationshipToProbandCode string
	RelationshipToProband     FamilyRelationship `gorm:"foreignKey:code;references:RelationshipToProbandCode"`
	AffectedStatusCode        string
	AffectedStatus            AffectedStatus `gorm:"foreignKey:Code;references:AffectedStatusCode"`
}

var FamilyTable = Table{
	Name:           "family",
	FederationName: "radiant_jdbc.public.family",
	Alias:          "f",
}

var FamilyRelationshipToProbandCodeField = Field{
	Name:          "relationship_to_proband_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         FamilyTable,
}

func (Family) TableName() string {
	return FamilyTable.Name
}
