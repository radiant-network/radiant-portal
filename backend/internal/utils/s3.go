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

type PreSignedURL struct {
	URL         string `json:"url"`
	URLExpireAt int64  `json:"expires_at"`
}

type PreSigner interface {
	GeneratePreSignedURL(url string) (*PreSignedURL, error)
}

const DEFAULT_AWS_REGION = "us-east-1"
const DEFAULT_S3_PRESIGNED_URL_EXPIRE = "60m"

type S3PreSigner struct {
	Config *aws.Config
	Expire time.Duration
}

func NewS3PreSigner() *S3PreSigner {
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

	return &S3PreSigner{
		Config: awsConfig,
		Expire: expire,
	}
}

func (ps *S3PreSigner) extractS3BucketAndKey(s3URL string) (string, string, error) {
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

func (ps *S3PreSigner) GeneratePreSignedURL(url string) (*PreSignedURL, error) {
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

	urlExpiresAt := time.Now().Add(ps.Expire).Unix()
	urlStr, err := req.Presign(ps.Expire)
	if err != nil {
		return nil, err
	}

	return &PreSignedURL{
		URL:         urlStr,
		URLExpireAt: urlExpiresAt,
	}, nil
}
