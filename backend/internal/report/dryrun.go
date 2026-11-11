package report

import "github.com/radiant-network/radiant-api/internal/types"

func ptr[T any](v T) *T { return &v }

// dryRunReport is the boot validation input for the deployed templates (a ConfigMap volume, never
// the repo): every pointer set and every slice filled so each template branch that reads a field
// runs once. The zero TranscriptReport covers the else branches.
func dryRunReport() types.TranscriptReport {
	return types.TranscriptReport{
		Case: types.ReportCase{
			CaseID: 1, SeqID: 2, TaskID: 3,
			SubmitterPatientID: "MRN-1", SubmitterSampleID: "S-1",
			IsProband: true, GenomeBuild: "GRCh38",
		},
		Variant: types.ReportVariant{
			LocusID: "100", Hgvsg: "chr1:g.100A>T", Rsnumber: "rs1", Chromosome: "1", Start: 100,
			Reference: "A", Alternate: "T", Symbol: "GENE1", ClinvarID: "12345",
			ClinvarInterpretation: []string{"Pathogenic"},
			Gnomad:                &types.ReportGnomad{Af: 0.0000007, Ac: 1, An: 1536252, Hom: 0},
		},
		Occurrence: types.ReportOccurrence{
			Zygosity: "HET", ParentalOrigin: "mother", FatherZygosity: "WT", MotherZygosity: "HET",
			TransmissionMode: "autosomal_dominant", AdRatio: 0.5, AdAlt: 10, AdTotal: 20,
		},
		Genes: []types.ReportGene{{
			Symbol: "GENE1",
			Omim:   []types.ReportOmim{{PhenotypeID: "123456", Name: "Syndrome 1", InheritanceCode: []string{"AD"}}},
		}},
		Transcripts: []types.ReportTranscript{{
			TranscriptID: "ENST00000001", Source: "Ensembl", Version: "1", Symbol: "GENE1",
			IsManeSelect: true, IsManePlus: true, IsCanonical: true,
			RefseqIDs: []string{"NM_000001.1"}, DnaChange: "c.1A>T", AaChange: "p.Met1Leu",
			ExonRank: "1", ExonTotal: "10", RevelScore: ptr[float32](0.9), CaddPhred: ptr[float32](25),
			Consequences: []string{"missense_variant"}, VepImpact: "MODERATE",
			Interpretation: &types.ReportGermlineInterpretation{
				Classification:          "LA6668-3",
				ClassificationCriterias: []string{"PVS1"},
				Condition:               "MONDO:0000001",
				TransmissionModes:       []string{"autosomal_dominant"},
				Pubmed:                  []types.InterpretationPubmed{{CitationID: "1", Citation: "Author A. Title. Journal. 2020."}},
			},
		}},
	}
}

// dryRunSomaticReport is the somatic twin: the germline input with the somatic fields set.
func dryRunSomaticReport() types.TranscriptReport {
	report := dryRunReport()
	report.Occurrence = types.ReportOccurrence{TumorAdRatio: 0.0661764705882353, TumorAdAlt: 17, TumorAdTotal: 34, NormalSeqID: 2}
	report.Variant.Cosmic = &types.ReportCosmic{CosmicID: "COSV56056643", SampleMutated: 99, Tier: "1"}
	report.Transcripts[0].Interpretation = nil
	report.Transcripts[0].SomaticInterpretation = &types.ReportSomaticInterpretation{
		TumoralType:                         "MONDO:0000004",
		Oncogenicity:                        "LA26332-9",
		OncogenicityClassificationCriterias: []string{"OS1"},
		ClinicalUtility:                     "category_ib",
		Pubmed:                              []types.InterpretationPubmed{{CitationID: "1", Citation: "Author A. Title. Journal. 2020."}},
	}
	return report
}
