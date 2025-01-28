package types

type PubmedCitation struct {
	ID 	string 					`json:"id,omitempty"`
	Nlm PubmedCitationDetails 	`json:"nlm,omitempty"`
}

type PubmedCitationDetails struct {
	Format 	string `json:"format,omitempty"`
}