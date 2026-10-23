// Package report builds the transcript report objects that the report templates render.
package report

import (
	"context"
	"fmt"
	"net/url"
	"sort"
	"strconv"

	"github.com/radiant-network/radiant-api/internal/types"
)

type dataReader interface {
	GetReportContext(ctx context.Context, caseId int, seqId int, taskId int) (*types.ReportContext, error)
	ListGermlineReportOccurrences(ctx context.Context, part int, seqId int, taskId int, locusIds []int) ([]types.ReportOccurrenceRow, error)
	ListSomaticReportOccurrences(ctx context.Context, part int, seqId int, taskId int, locusIds []int) ([]types.ReportOccurrenceRow, error)
	ListReportConsequences(ctx context.Context, locusIds []int) ([]types.ReportConsequenceRow, error)
	ListReportOmim(ctx context.Context, symbols []string) ([]types.ReportOmimRow, error)
}

type interpretationLister interface {
	ListGermlineForReport(ctx context.Context, caseId string, sequencingId string, locusIds []string) ([]types.InterpretationGermline, error)
	ListSomaticForReport(ctx context.Context, caseId string, sequencingId string, locusIds []string) ([]types.InterpretationSomatic, error)
}

type Builder struct {
	data            dataReader
	interpretations interpretationLister
}

func NewBuilder(data dataReader, interpretations interpretationLister) *Builder {
	return &Builder{data: data, interpretations: interpretations}
}

// occurrenceLister reads the occurrences of one report kind; interpretationAttacher sets the
// interpretation of that kind on the transcript rows of one locus.
type occurrenceLister func(ctx context.Context, part int, seqId int, taskId int, locusIds []int) ([]types.ReportOccurrenceRow, error)
type interpretationAttacher func(ctx context.Context, caseId string, seqId string, locusIds []string) (interpretationSet, error)

// interpretationSet knows which transcripts of a locus carry an interpretation (they stay in the
// report even without MANE Select) and sets the interpretation on the rows kept.
type interpretationSet struct {
	interpreted map[string]map[string]bool
	attach      func(locusId string, transcripts []types.ReportTranscript)
}

func (s *interpretationSet) mark(locusId, transcriptId string) {
	if s.interpreted == nil {
		s.interpreted = map[string]map[string]bool{}
	}
	if s.interpreted[locusId] == nil {
		s.interpreted[locusId] = map[string]bool{}
	}
	s.interpreted[locusId][transcriptId] = true
}

// BuildGermline returns one report per locus that is a germline occurrence of the sequencing and
// task, in the order of locusIds; a locus with no occurrence is absent. It returns nil when the
// task is not a task of that sequencing of that case.
func (b *Builder) BuildGermline(ctx context.Context, caseId int, seqId int, taskId int, locusIds []int) ([]types.TranscriptReport, error) {
	return b.build(ctx, caseId, seqId, taskId, locusIds, b.data.ListGermlineReportOccurrences, b.germlineInterpretations)
}

// BuildSomatic is the somatic twin of BuildGermline: seqId is the tumor sequencing.
func (b *Builder) BuildSomatic(ctx context.Context, caseId int, seqId int, taskId int, locusIds []int) ([]types.TranscriptReport, error) {
	return b.build(ctx, caseId, seqId, taskId, locusIds, b.data.ListSomaticReportOccurrences, b.somaticInterpretations)
}

func (b *Builder) germlineInterpretations(ctx context.Context, caseId string, seqId string, locusIds []string) (interpretationSet, error) {
	interpretations, err := b.interpretations.ListGermlineForReport(ctx, caseId, seqId, locusIds)
	if err != nil {
		return interpretationSet{}, fmt.Errorf("list germline interpretations: %w", err)
	}
	var set interpretationSet
	byTranscript := make(map[string]types.InterpretationGermline, len(interpretations))
	for _, interpretation := range interpretations {
		byTranscript[interpretation.LocusId+"/"+interpretation.TranscriptId] = interpretation
		set.mark(interpretation.LocusId, interpretation.TranscriptId)
	}
	set.attach = func(locusId string, transcripts []types.ReportTranscript) {
		for i := range transcripts {
			if interpretation, found := byTranscript[locusId+"/"+transcripts[i].TranscriptID]; found {
				transcripts[i].Interpretation = &types.ReportGermlineInterpretation{
					Classification:          interpretation.Classification,
					ClassificationCriterias: interpretation.ClassificationCriterias,
					Condition:               interpretation.Condition,
					TransmissionModes:       interpretation.TransmissionModes,
					Pubmed:                  interpretation.Pubmed,
				}
			}
		}
	}
	return set, nil
}

func (b *Builder) somaticInterpretations(ctx context.Context, caseId string, seqId string, locusIds []string) (interpretationSet, error) {
	interpretations, err := b.interpretations.ListSomaticForReport(ctx, caseId, seqId, locusIds)
	if err != nil {
		return interpretationSet{}, fmt.Errorf("list somatic interpretations: %w", err)
	}
	var set interpretationSet
	byTranscript := make(map[string]types.InterpretationSomatic, len(interpretations))
	for _, interpretation := range interpretations {
		byTranscript[interpretation.LocusId+"/"+interpretation.TranscriptId] = interpretation
		set.mark(interpretation.LocusId, interpretation.TranscriptId)
	}
	set.attach = func(locusId string, transcripts []types.ReportTranscript) {
		for i := range transcripts {
			if interpretation, found := byTranscript[locusId+"/"+transcripts[i].TranscriptID]; found {
				transcripts[i].SomaticInterpretation = &types.ReportSomaticInterpretation{
					TumoralType:                         interpretation.TumoralType,
					Oncogenicity:                        interpretation.Oncogenicity,
					OncogenicityClassificationCriterias: interpretation.OncogenicityClassificationCriterias,
					ClinicalUtility:                     interpretation.ClinicalUtility,
					Pubmed:                              interpretation.Pubmed,
				}
			}
		}
	}
	return set, nil
}

func (b *Builder) build(ctx context.Context, caseId int, seqId int, taskId int, locusIds []int, listOccurrences occurrenceLister, attachInterpretations interpretationAttacher) ([]types.TranscriptReport, error) {
	reportContext, err := b.data.GetReportContext(ctx, caseId, seqId, taskId)
	if err != nil {
		return nil, err
	}
	if reportContext == nil {
		return nil, nil
	}

	occurrences, err := listOccurrences(ctx, reportContext.Part, seqId, taskId, locusIds)
	if err != nil {
		return nil, err
	}
	reports := []types.TranscriptReport{}
	if len(occurrences) == 0 {
		return reports, nil
	}

	foundLoci := make([]int, 0, len(occurrences))
	foundLociAsStrings := make([]string, 0, len(occurrences))
	occurrenceByLocus := make(map[int64]types.ReportOccurrenceRow, len(occurrences))
	for _, occurrence := range occurrences {
		occurrenceByLocus[occurrence.LocusID] = occurrence
		foundLoci = append(foundLoci, int(occurrence.LocusID))
		foundLociAsStrings = append(foundLociAsStrings, strconv.FormatInt(occurrence.LocusID, 10))
	}

	interpretations, err := attachInterpretations(ctx, strconv.Itoa(caseId), strconv.Itoa(seqId), foundLociAsStrings)
	if err != nil {
		return nil, fmt.Errorf("attach interpretations: %w", err)
	}

	consequences, err := b.data.ListReportConsequences(ctx, foundLoci)
	if err != nil {
		return nil, err
	}
	transcriptsByLocus := make(map[int64][]types.ReportTranscript)
	rowsByLocus := make(map[int64][]types.ReportConsequenceRow)
	for _, row := range consequences {
		rowsByLocus[row.LocusID] = append(rowsByLocus[row.LocusID], row)
	}
	symbols := map[string]bool{}
	for locusId, rows := range rowsByLocus {
		transcripts := buildTranscripts(rows, interpretations.interpreted[strconv.FormatInt(locusId, 10)])
		transcriptsByLocus[locusId] = transcripts
		for _, transcript := range transcripts {
			symbols[transcript.Symbol] = true
		}
	}

	omimRows, err := b.data.ListReportOmim(ctx, sortedKeys(symbols))
	if err != nil {
		return nil, err
	}
	omimBySymbol := make(map[string][]types.ReportOmim)
	for _, row := range omimRows {
		omimBySymbol[row.Symbol] = append(omimBySymbol[row.Symbol], types.ReportOmim{
			PhenotypeID:     row.OmimPhenotypeID,
			Name:            row.Panel,
			InheritanceCode: row.InheritanceCode,
		})
	}

	for _, locusId := range locusIds {
		occurrence, ok := occurrenceByLocus[int64(locusId)]
		if !ok {
			continue
		}
		locus := strconv.Itoa(locusId)
		transcripts := transcriptsByLocus[occurrence.LocusID]
		if transcripts == nil {
			transcripts = []types.ReportTranscript{}
		}
		interpretations.attach(locus, transcripts)
		reports = append(reports, types.TranscriptReport{
			Case: types.ReportCase{
				CaseID:             caseId,
				SeqID:              seqId,
				TaskID:             taskId,
				SubmitterPatientID: reportContext.SubmitterPatientID,
				SubmitterSampleID:  reportContext.SubmitterSampleID,
				IsProband:          reportContext.IsProband,
				GenomeBuild:        reportContext.GenomeBuild,
			},
			Variant:     buildVariant(occurrence),
			Occurrence:  buildOccurrence(occurrence),
			Genes:       buildGenes(transcripts, omimBySymbol),
			Transcripts: transcripts,
		})
	}
	return reports, nil
}

func buildVariant(row types.ReportOccurrenceRow) types.ReportVariant {
	variant := types.ReportVariant{
		LocusID:               strconv.FormatInt(row.LocusID, 10),
		Hgvsg:                 row.Hgvsg,
		Rsnumber:              row.Rsnumber,
		Chromosome:            row.Chromosome,
		Start:                 row.Start,
		Reference:             row.Reference,
		Alternate:             row.Alternate,
		Symbol:                row.Symbol,
		ClinvarID:             row.ClinvarName,
		ClinvarInterpretation: row.ClinvarInterpretation,
	}
	if row.GnomadAf != nil || row.GnomadAc != nil {
		variant.Gnomad = &types.ReportGnomad{
			Af:  deref(row.GnomadAf),
			Ac:  deref(row.GnomadAc),
			An:  deref(row.GnomadAn),
			Hom: deref(row.GnomadHom),
		}
	}
	// COSMIC counts as known only with an id and at least one mutated sample, the arranger rule.
	if cosmicID := cosmicIDFromURL(row.CosmicMutationURL); cosmicID != "" && deref(row.CosmicSampleMutated) > 0 {
		variant.Cosmic = &types.ReportCosmic{CosmicID: cosmicID, SampleMutated: deref(row.CosmicSampleMutated), Tier: row.CosmicTier}
	}
	return variant
}

// cosmicIDFromURL reads the mutation id out of cmc_mutation_url (`.../overview?id=<id>&genome=37`),
// the only COSMIC identifier the variant table carries.
func cosmicIDFromURL(mutationURL string) string {
	parsed, err := url.Parse(mutationURL)
	if err != nil {
		return ""
	}
	return parsed.Query().Get("id")
}

func buildOccurrence(row types.ReportOccurrenceRow) types.ReportOccurrence {
	return types.ReportOccurrence{
		Zygosity:         row.Zygosity,
		ParentalOrigin:   row.ParentalOrigin,
		FatherZygosity:   row.FatherZygosity,
		MotherZygosity:   row.MotherZygosity,
		TransmissionMode: row.TransmissionMode,
		AdRatio:          row.AdRatio,
		AdAlt:            row.AdAlt,
		AdTotal:          row.AdTotal,
		TumorAdRatio:     row.TumorAdRatio,
		TumorAdAlt:       row.TumorAdAlt,
		TumorAdTotal:     row.TumorAdTotal,
		NormalSeqID:      deref(row.NormalSeqID),
	}
}

func buildGenes(transcripts []types.ReportTranscript, omimBySymbol map[string][]types.ReportOmim) []types.ReportGene {
	symbols := map[string]bool{}
	for _, transcript := range transcripts {
		symbols[transcript.Symbol] = true
	}
	genes := []types.ReportGene{}
	for _, symbol := range sortedKeys(symbols) {
		omim := omimBySymbol[symbol]
		if omim == nil {
			omim = []types.ReportOmim{}
		}
		genes = append(genes, types.ReportGene{Symbol: symbol, Omim: omim})
	}
	return genes
}

const sourceRefSeq = "RefSeq"

// buildTranscripts applies the rows rule of the report to the consequence rows of one locus:
// the MANE Select transcripts and the interpreted ones (a locus with neither gets no row), one
// row per Ensembl transcript (a NULL source is a row annotated before RefSeq transcripts were
// loaded, so it counts as Ensembl), the RefSeq transcript shown through the MANE pair, and a
// RefSeq transcript kept only when its gene has no Ensembl transcript.
func buildTranscripts(rows []types.ReportConsequenceRow, interpreted map[string]bool) []types.ReportTranscript {
	refseqByID := map[string]types.ReportConsequenceRow{}
	ensemblSymbols := map[string]bool{}
	for _, row := range rows {
		if row.Source == sourceRefSeq {
			refseqByID[row.TranscriptID] = row
		} else {
			ensemblSymbols[row.Symbol] = true
		}
	}

	transcripts := []types.ReportTranscript{}
	for _, row := range rows {
		var refseqIDs []string
		if row.Source == sourceRefSeq {
			if ensemblSymbols[row.Symbol] {
				continue
			}
			refseqIDs = []string{versionedID(row)}
		} else {
			if row.ManeSelect != "" {
				refseqIDs = append(refseqIDs, row.ManeSelect)
			} else if pair, ok := refseqByID[row.ManePairTranscriptID]; ok {
				refseqIDs = append(refseqIDs, versionedID(pair))
			}
		}
		transcripts = append(transcripts, types.ReportTranscript{
			TranscriptID: row.TranscriptID,
			Source:       row.Source,
			Version:      row.TranscriptVersion,
			Symbol:       row.Symbol,
			IsManeSelect: row.IsManeSelect,
			IsManePlus:   row.IsManePlus,
			IsCanonical:  row.IsCanonical,
			RefseqIDs:    refseqIDs,
			DnaChange:    row.DnaChange,
			AaChange:     row.AaChange,
			ExonRank:     row.ExonRank,
			ExonTotal:    row.ExonTotal,
			RevelScore:   row.RevelScore,
			CaddPhred:    row.CaddPhred,
			Consequences: row.Consequences,
			VepImpact:    row.VepImpact,
		})
	}

	kept := transcripts[:0]
	for _, transcript := range transcripts {
		if transcript.IsManeSelect || interpreted[transcript.TranscriptID] {
			kept = append(kept, transcript)
		}
	}
	transcripts = kept

	sort.SliceStable(transcripts, func(i, j int) bool {
		a, b := transcripts[i], transcripts[j]
		if a.IsManeSelect != b.IsManeSelect {
			return a.IsManeSelect
		}
		if a.IsManePlus != b.IsManePlus {
			return a.IsManePlus
		}
		if a.IsCanonical != b.IsCanonical {
			return a.IsCanonical
		}
		if a.Symbol != b.Symbol {
			return a.Symbol < b.Symbol
		}
		return a.TranscriptID < b.TranscriptID
	})
	return transcripts
}

func versionedID(row types.ReportConsequenceRow) string {
	if row.TranscriptVersion == "" {
		return row.TranscriptID
	}
	return row.TranscriptID + "." + row.TranscriptVersion
}

func sortedKeys(set map[string]bool) []string {
	keys := make([]string, 0, len(set))
	for key := range set {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

func deref[T int | float64](value *T) T {
	if value == nil {
		var zero T
		return zero
	}
	return *value
}
