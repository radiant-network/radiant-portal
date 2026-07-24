package utils_test

import (
	"bytes"
	"os"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	testutils.StartObjectStoreContainer()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}

func Test_extractS3BucketAndKey_Valid(t *testing.T) {
	s3loc, err := utils.ExtractS3BucketAndKey("s3://test/foo/bar.txt")
	assert.Nil(t, err)
	assert.NotNil(t, s3loc)
	assert.Equal(t, s3loc.Bucket, "test")
	assert.Equal(t, s3loc.Key, "foo/bar.txt")
}

func Test_extractS3BucketAndKey_Invalid_URL(t *testing.T) {
	s3loc, err := utils.ExtractS3BucketAndKey("//test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Nil(t, s3loc)
}

func Test_extractS3BucketAndKey_Not_S3_URL(t *testing.T) {
	s3loc, err := utils.ExtractS3BucketAndKey("http://test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Nil(t, s3loc)
}

func Test_extractFileName_Valid(t *testing.T) {
	filename, err := utils.ExtractFileName("s3://test/foo/bar.txt")
	assert.Nil(t, err)
	assert.NotNil(t, filename)
	assert.Equal(t, "bar.txt", *filename)
}

func Test_extractFileName_Invalid_URL(t *testing.T) {
	filename, err := utils.ExtractFileName("//test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Nil(t, filename)
}

func Test_extractFileName_Not_S3_URL(t *testing.T) {
	filename, err := utils.ExtractFileName("http://test/foo/bar.txt")
	assert.NotNil(t, err)
	assert.Nil(t, filename)
}

func Test_GetMetadata_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{MinIO: true}, func(t *testing.T, env *testutils.Env) {
		t.Setenv("AWS_ENDPOINT_URL", env.MinIO.Endpoint)
		t.Setenv("AWS_ACCESS_KEY_ID", "admin")
		t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
		t.Setenv("AWS_USE_SSL", "false")

		bucketName := "test-bucket"
		objectName := "test-file.txt"
		content := []byte("hello world") // Size: 11 bytes

		err := env.MinIO.Client.MakeBucket(env.Ctx, bucketName, minio.MakeBucketOptions{})
		assert.NoError(t, err)

		_, err = env.MinIO.Client.PutObject(env.Ctx, bucketName, objectName, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})
		assert.NoError(t, err)

		s3fs, _ := utils.NewS3Store()
		metadata, err := s3fs.GetMetadata("s3://test-bucket/test-file.txt")

		expected := utils.FileMetadata{
			Size: 11,
			Hash: "5eb63bbbe01eeed093cb22bb8f5acdc3",
		}

		assert.NoError(t, err)
		assert.NotNil(t, metadata)
		assert.Equal(t, expected, *metadata)
	})
}
