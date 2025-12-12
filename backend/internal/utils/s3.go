package utils

import (
	"fmt"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

const DEFAULT_AWS_REGION = "us-east-1"
const DEFAULT_S3_PRESIGNED_URL_EXPIRE = "60m"

type PreSignedURL struct {
	URL         string `json:"url"`
	URLExpireAt int64  `json:"urlExpireAt"`
}

type S3PreSigner interface {
	GenerateS3PreSignedURL(url string) (*PreSignedURL, error)
}

type DefaultS3PreSigner struct {
	Config *aws.Config
	Expire time.Duration
}

func NewS3PreSigner() *DefaultS3PreSigner {
	endpoint := GetEnvOrDefault("AWS_ENDPOINT_URL", "")
	region := GetEnvOrDefault("AWS_REGION", DEFAULT_AWS_REGION)
	useSSL := GetEnvOrDefault("AWS_USE_SSL", "true") == "true"

	expireStr := GetEnvOrDefault("S3_PRESIGNED_URL_EXPIRE", DEFAULT_S3_PRESIGNED_URL_EXPIRE)
	expire, err := time.ParseDuration(expireStr)
	if err != nil {
		log.Fatalf("Invalid duration for S3_PRESIGNED_URL_EXPIRE: %v", err)
	}

	forcePathStyle := endpoint != "" // if endpoint is set, force path style
	awsConfig := &aws.Config{
		Region:           aws.String(region),
		Endpoint:         aws.String(endpoint),
		S3ForcePathStyle: aws.Bool(forcePathStyle),
		DisableSSL:       aws.Bool(!useSSL),
	}

	return &DefaultS3PreSigner{
		Config: awsConfig,
		Expire: expire,
	}
}

func (ps *DefaultS3PreSigner) extractS3BucketAndKey(s3URL string) (string, string, error) {
	parsed, err := url.Parse(s3URL)
	if err != nil {
		return "", "", fmt.Errorf("invalid URL: %w", err)
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

	sess, err := session.NewSession(ps.Config)
	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})

	expireAt := time.Now().Add(ps.Expire).Unix()
	urlStr, err := req.Presign(ps.Expire)
	if err != nil {
		return nil, err
	}

	return &PreSignedURL{
		URL:         urlStr,
		URLExpireAt: expireAt,
	}, nil
}
