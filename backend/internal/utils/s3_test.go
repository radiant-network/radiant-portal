package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_extractS3BucketAndKey_Valid(t *testing.T) {
	presigner := DefaultS3PreSigner{}
	bucket, key, err := presigner.extractS3BucketAndKey("s3://test/foo/bar.txt")
	assert.Nil(t, err)
	assert.Equal(t, bucket, "test")
	assert.Equal(t, key, "foo/bar.txt")
}

func Test_extractS3BucketAndKey_Invalid_URL(t *testing.T) {
	presigner := DefaultS3PreSigner{}
	bucket, key, err := presigner.extractS3BucketAndKey("//test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Equal(t, bucket, "")
	assert.Equal(t, key, "")
}

func Test_extractS3BucketAndKey_Not_S3_URL(t *testing.T) {
	presigner := DefaultS3PreSigner{}
	bucket, key, err := presigner.extractS3BucketAndKey("http://test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Equal(t, bucket, "")
	assert.Equal(t, key, "")
}
