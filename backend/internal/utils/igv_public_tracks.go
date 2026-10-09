package utils

import (
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

// IGVPublicTracksPrefixEnv is the S3 prefix (e.g. s3://bucket/igv/) where the radiant-import-igv-tracks
// ETL job writes the public IGV reference files. Empty disables the public tracks.
const IGVPublicTracksPrefixEnv = "IGV_PUBLIC_TRACKS_PREFIX"

// igvPublicTrackFiles maps each public track id to the file the ETL job writes under the prefix
// (file names of Qlin's etl_import_igv). Each file has its .tbi index next to it.
var igvPublicTrackFiles = map[string]string{
	"clinvar":                "clinvar.vcf.gz",
	"clinvar_sv":             "nstd102.GRCh38.variant_call.vcf.gz",
	"dgv":                    "DGV_GS_hg38.cleaned.sorted.gff3.gz",
	"clingen_gene":           "ClinGen_gene_curation_list_GRCh38.sorted.gff3.gz",
	"clingen_region":         "ClinGen_region_curation_list_GRCh38.sorted.gff3.gz",
	"gnomad_sv":              "gnomad.v4.1.sv.sites.vcf.gz",
	"gnomad_cnv":             "gnomad.v4.1.cnv.all.vcf.gz",
	"segmental_duplications": "hg38.genomicSuperDups.gff3.gz",
	"repeat_masker":          "hg38.rmsk.gff3.gz",
	"simple_repeats":         "hg38.simpleRepeat.gff3.gz",
	"self_chain":             "hg38.chainSelf.gff3.gz",
}

// IGVPublicTracksPrefixFromEnv reads IGVPublicTracksPrefixEnv. A set value must be an S3 URL, else
// every IGV request would fail to presign.
func IGVPublicTracksPrefixFromEnv() (string, error) {
	prefix := GetEnvOrDefault(IGVPublicTracksPrefixEnv, "")
	if prefix == "" {
		return "", nil
	}
	if _, err := ExtractS3BucketAndKey(prefix); err != nil {
		return "", fmt.Errorf("invalid %s %q: %w", IGVPublicTracksPrefixEnv, prefix, err)
	}
	return prefix, nil
}

// PrepareIGVPublicTracks presigns every public track file and its index under prefix.
// An empty prefix returns no track.
func PrepareIGVPublicTracks(prefix string, presigner PreSigner) (map[string]types.IGVPublicTrack, error) {
	tracks := make(map[string]types.IGVPublicTrack)
	if prefix == "" {
		return tracks, nil
	}

	base := strings.TrimSuffix(prefix, "/") + "/"
	for id, file := range igvPublicTrackFiles {
		data, err := presigner.GeneratePreSignedURL(base + file)
		if err != nil {
			return nil, err
		}
		index, err := presigner.GeneratePreSignedURL(base + file + ".tbi")
		if err != nil {
			return nil, err
		}
		tracks[id] = types.IGVPublicTrack{
			URL:              data.URL,
			URLExpireAt:      data.URLExpireAt,
			IndexURL:         index.URL,
			IndexURLExpireAt: index.URLExpireAt,
		}
	}
	return tracks, nil
}
