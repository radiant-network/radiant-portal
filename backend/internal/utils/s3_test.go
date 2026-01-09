package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_extractS3BucketAndKey_Valid(t *testing.T) {
	s3loc, err := extractS3BucketAndKey("s3://test/foo/bar.txt")
	assert.Nil(t, err)
	assert.Equal(t, s3loc.Bucket, "test")
	assert.Equal(t, s3loc.Key, "foo/bar.txt")
}

func Test_extractS3BucketAndKey_Invalid_URL(t *testing.T) {
	s3loc, err := extractS3BucketAndKey("//test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Equal(t, s3loc.Bucket, "")
	assert.Equal(t, s3loc.Key, "")
}

func Test_extractS3BucketAndKey_Not_S3_URL(t *testing.T) {
	s3loc, err := extractS3BucketAndKey("http://test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Equal(t, s3loc.Bucket, "")
	assert.Equal(t, s3loc.Key, "")
}
