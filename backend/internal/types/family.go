package types

type Family struct {
	ID                        int
	CaseID                    int
	Case                      Case `gorm:"foreignKey:ID;references:CaseID"`
	FamilyMemberID            int
	FamilyMember              Patient            `gorm:"foreignKey:ID;references:FamilyMemberID"`
	RelationshipToProbandCode string             `gorm:"column:relationship_to_proband"`
	RelationshipToProband     FamilyRelationship `gorm:"foreignKey:code;references:RelationshipToProbandCode"`
	AffectedStatusCode        string             `gorm:"column:affected_status"`
	AffectedStatus            AffectedStatus     `gorm:"foreignKey:Code;references:AffectedStatusCode"`
}

var FamilyTable = Table{
	Name: "radiant_jdbc.public.family",
}

func (Family) TableName() string {
	return FamilyTable.Name
}
