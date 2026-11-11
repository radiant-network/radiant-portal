package utils

import (
	"strings"
	"testing"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type countingCredentialsProvider struct {
	retrieved int
}

func (p *countingCredentialsProvider) Retrieve() (credentials.Value, error) {
	p.retrieved++
	return credentials.Value{AccessKeyID: "access", SecretAccessKey: "secret", ProviderName: "counting"}, nil
}

func (p *countingCredentialsProvider) IsExpired() bool { return false }

func Test_S3PreSigner_ResolvesCredentialsOnceForManyURLs(t *testing.T) {
	provider := &countingCredentialsProvider{}
	ps, err := newS3PreSigner(&aws.Config{
		Region:      aws.String("us-east-1"),
		Credentials: credentials.NewCredentials(provider),
	}, time.Hour)
	require.NoError(t, err)

	for _, key := range []string{"a.vcf.gz", "a.vcf.gz.tbi", "b.bw"} {
		presigned, err := ps.GeneratePreSignedURL("s3://bucket/igv/" + key)
		require.NoError(t, err)
		assert.True(t, strings.Contains(presigned.URL, "/igv/"+key+"?"), "got %s", presigned.URL)
		assert.Contains(t, presigned.URL, "X-Amz-Signature=")
	}
	assert.Equal(t, 1, provider.retrieved)
}

func Test_S3PreSigner_InvalidURLReturnsError(t *testing.T) {
	ps, err := newS3PreSigner(&aws.Config{
		Region:      aws.String("us-east-1"),
		Credentials: credentials.NewStaticCredentials("access", "secret", ""),
	}, time.Hour)
	require.NoError(t, err)

	presigned, err := ps.GeneratePreSignedURL("https://bucket/igv/a.vcf.gz")

	assert.Error(t, err)
	assert.Nil(t, presigned)
}
