package types

import (
	"time"
)

type InterpretationCommon struct {
    ID               		string				    `json:"id,omitempty"`
	SequencingId        	string         			`json:"sequencing_id,omitempty"`
	LocusId               	string             		`json:"locus_id,omitempty"`
	TranscriptId     		string             		`json:"transcript_id,omitempty"`
    Interpretation          string              	`json:"interpretation,omitempty"`
    Pubmed	                []InterpretationPubmed	`json:"pubmed,omitempty"`
	CreatedBy               string              	`json:"-"`
    CreatedByName          	string        			`json:"-"`      	
    CreatedAt               time.Time     			`json:"-"`      	
    UpdatedBy              	string      			`json:"-"`      	
    UpdatedByName         	string       			`json:"-"`       	
    UpdatedAt              	time.Time    			`json:"-"`
}

type InterpretationGerminal struct {
    InterpretationCommon
	Condition				string					`json:"condition,omitempty"`
	Classification      	string             		`json:"classification,omitempty"`
    ClassificationCriterias []string            	`json:"classification_criterias,omitempty"`
    TransmissionModes       []string            	`json:"transmission_modes,omitempty"`
} // @name InterpretationGerminal

type InterpretationSomatic struct {
	InterpretationCommon
	TumoralType				string					`json:"tumoral_type,omitempty"`
	Oncogenicity      	    string             		`json:"oncogenicity,omitempty"`
    OncogenicityClassificationCriterias []string    `json:"oncogenicity_classification_criterias,omitempty"`
    ClinicalUtility         string            	    `json:"clinical_utility,omitempty"`
} // @name InterpretationSomatic

type InterpretationPubmed struct {
	CitationID			  string              `json:"citation_id,omitempty"`
	Citation			  string              `json:"citation,omitempty"`
	
} // @name InterpretationPubmed

var InterpretationGerminalTable = Table{
	Name:  "interpretation_germinal",
}

var InterpretationSomaticTable = Table{
	Name:  "interpretation_somatic",
}

type InterpretationCommonDAO struct {
    ID 						string `gorm:"primary_key; unique; type:uuid; default:gen_random_uuid()"`
	SequencingId        	string         			
	LocusId               	string             		
	TranscriptId     		string             		         	
    Interpretation          string              	
    Pubmed	                string	
    CreatedBy               string              	
    CreatedByName          	string              	
    CreatedAt               time.Time           	
    UpdatedBy              	string              	
    UpdatedByName         	string              	
    UpdatedAt              	time.Time     
}

type InterpretationGerminalDAO struct {
    InterpretationCommonDAO           		
	Condition				string					
	Classification      	string             		
    ClassificationCriterias string            	
    TransmissionModes       string            	      		
}

type InterpretationSomaticDAO struct {
    InterpretationCommonDAO         		
	TumoralType				string					
	Oncogenicity      	    string             		
    OncogenicityClassificationCriterias string            	
    ClinicalUtility         string            	    		
}

