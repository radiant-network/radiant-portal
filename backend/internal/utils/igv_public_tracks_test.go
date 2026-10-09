package utils_test

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_PrepareIGVPublicTracks_EmptyPrefixReturnsNoTrack(t *testing.T) {
	tracks, err := utils.PrepareIGVPublicTracks("", testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	assert.NotNil(t, tracks)
	assert.Empty(t, tracks)
}

func Test_PrepareIGVPublicTracks_PresignsEveryFileAndItsIndex(t *testing.T) {
	tracks, err := utils.PrepareIGVPublicTracks("s3://tracks/igv/", testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	assert.Len(t, tracks, 11)
	assert.Equal(t, types.IGVPublicTrack{
		URL:              "presigned.s3://tracks/igv/clinvar.vcf.gz",
		URLExpireAt:      1234567890,
		IndexURL:         "presigned.s3://tracks/igv/clinvar.vcf.gz.tbi",
		IndexURLExpireAt: 1234567890,
	}, tracks["clinvar"])
	assert.Equal(t, types.IGVPublicTrack{
		URL:              "presigned.s3://tracks/igv/ClinGen_region_curation_list_GRCh38.sorted.gff3.gz",
		URLExpireAt:      1234567890,
		IndexURL:         "presigned.s3://tracks/igv/ClinGen_region_curation_list_GRCh38.sorted.gff3.gz.tbi",
		IndexURLExpireAt: 1234567890,
	}, tracks["clingen_region"])
}

func Test_PrepareIGVPublicTracks_PrefixWithoutTrailingSlash(t *testing.T) {
	tracks, err := utils.PrepareIGVPublicTracks("s3://tracks/igv", testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	assert.Equal(t, "presigned.s3://tracks/igv/DGV_GS_hg38.cleaned.sorted.gff3.gz", tracks["dgv"].URL)
}

func Test_PrepareIGVPublicTracks_InvalidPrefixReturnsError(t *testing.T) {
	tracks, err := utils.PrepareIGVPublicTracks("https://tracks/igv/", testutils.NewMockS3PreSigner())

	assert.Error(t, err)
	assert.Nil(t, tracks)
}

func Test_IGVPublicTracksPrefixFromEnv_Unset(t *testing.T) {
	t.Setenv(utils.IGVPublicTracksPrefixEnv, "")

	prefix, err := utils.IGVPublicTracksPrefixFromEnv()

	require.NoError(t, err)
	assert.Empty(t, prefix)
}

func Test_IGVPublicTracksPrefixFromEnv_S3Prefix(t *testing.T) {
	t.Setenv(utils.IGVPublicTracksPrefixEnv, "s3://tracks/igv/")

	prefix, err := utils.IGVPublicTracksPrefixFromEnv()

	require.NoError(t, err)
	assert.Equal(t, "s3://tracks/igv/", prefix)
}

func Test_IGVPublicTracksPrefixFromEnv_NotAnS3URL(t *testing.T) {
	t.Setenv(utils.IGVPublicTracksPrefixEnv, "https://tracks/igv/")

	prefix, err := utils.IGVPublicTracksPrefixFromEnv()

	assert.Error(t, err)
	assert.Empty(t, prefix)
}
