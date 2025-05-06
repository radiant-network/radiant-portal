package utils

import "github.com/Ferlab-Ste-Justine/radiant-api/internal/types"

func ConsequenceToTranscript(csq types.Consequence) types.Transcript {
	return types.Transcript{
		TranscriptId:       csq.EnsemblTranscriptId,
		Canonical:          csq.Canonical,
		ManeSelect:         csq.ManeSelect,
		ManePlus:           csq.ManePlus,
		ExonRank:           csq.ExonRank,
		ExonTotal:          csq.ExonTotal,
		CodingDnaChange:    csq.CodingDnaChange,
		AaChange:           csq.AaChange,
		Consequence:        csq.Consequence,
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
		RefseqMrnaId:       csq.RefseqMrnaId,
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
			Picked:       firstConsequence.Picked,
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

	return variantConsequences
}
