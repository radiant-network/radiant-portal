package utils

import (
	"fmt"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

const EXPIRE = 60 * time.Minute

type PreSignedURL struct {
	URL         string `json:"url"`
	URLExpireAt int64  `json:"urlExpireAt"`
}

type S3PreSigner interface {
	GenerateS3PreSignedURL(url string) (*PreSignedURL, error)
}

type DefaultS3PreSigner struct{}

func (ps *DefaultS3PreSigner) extractS3BucketAndKey(s3URL string) (string, string, error) {
	parsed, err := url.Parse(s3URL)
	if err != nil {
		return "", "", fmt.Errorf("Invalid URL: %w", err)
	}

	if parsed.Scheme != "s3" {
		return "", "", fmt.Errorf("URL is not an S3 URL")
	}

	bucket := parsed.Host
	key := strings.TrimPrefix(parsed.Path, "/")

	return bucket, key, nil
}

func (ps *DefaultS3PreSigner) GenerateS3PreSignedURL(url string) (*PreSignedURL, error) {
	bucket, key, err := ps.extractS3BucketAndKey(url)
	if err != nil {
		return nil, err
	}

	endpoint := os.Getenv("AWS_ENDPOINT_URL")
	region := os.Getenv("AWS_REGION")
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	useSSL := os.Getenv("AWS_USE_SSL") == "true"

	awsConfig := &aws.Config{
		Region:           aws.String(region),
		Credentials:      credentials.NewStaticCredentials(accessKey, secretKey, ""),
		Endpoint:         aws.String(endpoint),
		S3ForcePathStyle: aws.Bool(true),
		DisableSSL:       aws.Bool(!useSSL),
	}

	sess, err := session.NewSession(awsConfig)
	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})

	expireAt := time.Now().Add(EXPIRE).Unix()
	urlStr, err := req.Presign(EXPIRE)
	if err != nil {
		return nil, err
	}

	return &PreSignedURL{
		URL:         urlStr,
		URLExpireAt: expireAt,
	}, nil
}
