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

const DefaultAwsRegion = "us-east-1"
const DefaultS3PresignedUrlExpire = "60m"

type PreSignedURL struct {
	URL         string `json:"url"`
	URLExpireAt int64  `json:"expires_at"`
}

type PreSigner interface {
	GeneratePreSignedURL(url string) (*PreSignedURL, error)
}

type S3PreSigner struct {
	Config *aws.Config
	Expire time.Duration
}

type S3Location struct {
	Bucket string
	Key    string
}

func NewS3PreSigner() *S3PreSigner {
	endpoint := GetEnvOrDefault("AWS_ENDPOINT_URL", "")
	region := GetEnvOrDefault("AWS_REGION", DefaultAwsRegion)
	useSSL := GetEnvOrDefault("AWS_USE_SSL", "true") == "true"

	expireStr := GetEnvOrDefault("S3_PRESIGNED_URL_EXPIRE", DefaultS3PresignedUrlExpire)
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

func ExtractS3BucketAndKey(s3URL string) (S3Location, error) {
	parsed, err := url.Parse(s3URL)
	if err != nil {
		return S3Location{"", ""}, fmt.Errorf("invalid URL: %w", err)
	}

	if parsed.Scheme != "s3" {
		return S3Location{"", ""}, fmt.Errorf("URL is not an S3 URL")
	}

	bucket := parsed.Host
	key := strings.TrimPrefix(parsed.Path, "/")

	return S3Location{bucket, key}, nil
}

func (ps *S3PreSigner) GeneratePreSignedURL(url string) (*PreSignedURL, error) {
	s3location, err := ExtractS3BucketAndKey(url)
	if err != nil {
		return nil, err
	}

	sess, err := session.NewSession(ps.Config)
	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(s3location.Bucket),
		Key:    aws.String(s3location.Key),
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

type S3FileMetadata struct {
	Size int64
	Hash string
}

type S3FileStore interface {
	GetMetadata(url string) (*S3FileMetadata, error)
}

type S3Store struct {
	svc *s3.S3
}

func NewS3Store() *S3Store {
	endpoint := GetEnvOrDefault("AWS_ENDPOINT_URL", "")
	region := GetEnvOrDefault("AWS_REGION", DefaultAwsRegion)
	useSSL := GetEnvOrDefault("AWS_USE_SSL", "true") == "true"

	forcePathStyle := endpoint != ""
	awsConfig := &aws.Config{
		Region:           aws.String(region),
		Endpoint:         aws.String(endpoint),
		S3ForcePathStyle: aws.Bool(forcePathStyle),
		DisableSSL:       aws.Bool(!useSSL),
	}

	sess, err := session.NewSession(awsConfig)
	if err != nil {
		log.Fatalf("Failed to create AWS session: %v", err)
	}

	s3svc := s3.New(sess)
	return &S3Store{svc: s3svc}
}

func (s *S3Store) GetMetadata(rawUrl string) (*S3FileMetadata, error) {
	s3location, err := ExtractS3BucketAndKey(rawUrl)
	if err != nil {
		return nil, err
	}

	out, err := s.svc.HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(s3location.Bucket),
		Key:    aws.String(s3location.Key),
	})
	if err != nil {
		if strings.Contains(err.Error(), "status code: 404") {
			return nil, nil
		}
		return nil, err
	}
	return &S3FileMetadata{
		Size: *out.ContentLength,
		Hash: strings.Trim(*out.ETag, `"`),
	}, nil
}
