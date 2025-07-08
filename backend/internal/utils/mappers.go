package utils

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"strings"
)

func ConsequenceToTranscript(csq types.Consequence) types.Transcript {
	return types.Transcript{
		TranscriptId:       csq.TranscriptId,
		IsCanonical:        csq.IsCanonical,
		IsManeSelect:       csq.IsManeSelect,
		IsManePlus:         csq.IsManePlus,
		ExonRank:           csq.ExonRank,
		ExonTotal:          csq.ExonTotal,
		DnaChange:          csq.DnaChange,
		AaChange:           csq.AaChange,
		Consequences:       csq.Consequences,
		VepImpact:          csq.VepImpact,
		SiftPred:           csq.SiftPred,
		SiftScore:          csq.SiftScore,
		FathmmPred:         csq.FathmmPred,
		FathmmScore:        csq.FathmmScore,
		CaddScore:          csq.CaddScore,
		CaddPhred:          csq.CaddPhred,
		DannScore:          csq.DannScore,
		LrtPred:            csq.LrtPred,
		LrtScore:           csq.LrtScore,
		RevelScore:         csq.RevelScore,
		Polyphen2HvarPred:  csq.Polyphen2HvarPred,
		Polyphen2HvarScore: csq.Polyphen2HvarScore,
		PhyloP17wayPrimate: csq.PhyloP17wayPrimate,
	}
}

func ConsequencesToVariantConsequences(consequences []types.Consequence) []types.VariantConsequence {
	var variantConsequences []types.VariantConsequence

	groupedBySymbol := GroupByProperty(consequences, func(c types.Consequence) string {
		return c.Symbol
	})

	for symbol, consequencesPerSymbol := range groupedBySymbol {
		firstConsequence := consequencesPerSymbol[0]
		variantConsequence := types.VariantConsequence{
			IsPicked:     firstConsequence.IsPicked,
			Symbol:       symbol,
			Biotype:      firstConsequence.Biotype,
			GnomadPli:    firstConsequence.GnomadPli,
			GnomadLoeuf:  firstConsequence.GnomadLoeuf,
			SpliceaiDs:   firstConsequence.SpliceaiDs,
			SpliceaiType: firstConsequence.SpliceaiType,
			Transcripts:  make([]types.Transcript, 0, len(consequencesPerSymbol)),
		}
		for _, csq := range consequencesPerSymbol {
			transcript := ConsequenceToTranscript(csq)
			variantConsequence.Transcripts = append(variantConsequence.Transcripts, transcript)
		}
		variantConsequences = append(variantConsequences, variantConsequence)
	}

	return SortConsequences(variantConsequences)
}

func PhenotypeUnparsedToJsonArrayOfTerms(unparsedPhenotype string) types.JsonArray[types.Term] {
	phenotypes := make(types.JsonArray[types.Term], 0)
	if len(unparsedPhenotype) > 0 {
		phenotypesUnparsedArray := strings.Split(unparsedPhenotype, "|")
		for _, phenotypeUnparsed := range phenotypesUnparsedArray {
			phenotype := strings.Split(phenotypeUnparsed, "__")
			phenotypes = append(phenotypes, types.Term{ID: phenotype[0], Name: phenotype[1]})
		}
	}
	return phenotypes
}
