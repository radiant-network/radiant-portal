package utils

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/url"
	"path"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
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
	// One client per presigner: a new session per URL would also resolve the credentials again,
	// a remote call with a web identity or instance role provider.
	svc *s3.S3
}

type S3Location struct {
	Bucket string
	Key    string
}

func NewS3PreSigner() *S3PreSigner {
	endpoint := GetEnvOrDefault("AWS_ENDPOINT_URL", "")
	region := GetEnvOrDefault("AWS_REGION", DefaultAwsRegion)
	useSSL := GetBoolEnvOrDefault("AWS_USE_SSL", true)

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

	ps, err := newS3PreSigner(awsConfig, expire)
	if err != nil {
		log.Fatalf("Failed to create S3 presigner session: %v", err)
	}
	return ps
}

func newS3PreSigner(awsConfig *aws.Config, expire time.Duration) (*S3PreSigner, error) {
	sess, err := session.NewSession(awsConfig)
	if err != nil {
		return nil, err
	}
	return &S3PreSigner{
		Config: awsConfig,
		Expire: expire,
		svc:    s3.New(sess),
	}, nil
}

func ExtractS3BucketAndKey(s3URL string) (*S3Location, error) {
	parsed, err := url.Parse(s3URL)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	if parsed.Scheme != "s3" {
		return nil, fmt.Errorf("URL is not an S3 URL")
	}

	bucket := parsed.Host
	key := strings.TrimPrefix(parsed.Path, "/")

	return &S3Location{bucket, key}, nil
}

func ExtractFileName(s3URL string) (*string, error) {
	parsed, err := url.Parse(s3URL)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	if parsed.Scheme != "s3" {
		return nil, fmt.Errorf("URL is not an S3 URL")
	}

	name := path.Base(parsed.Path)

	return &name, nil
}

func (ps *S3PreSigner) GeneratePreSignedURL(url string) (*PreSignedURL, error) {
	s3location, err := ExtractS3BucketAndKey(url)
	if err != nil {
		return nil, err
	}

	req, _ := ps.svc.GetObjectRequest(&s3.GetObjectInput{
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

type FileMetadata struct {
	Size int64
	Hash string
}

type FileMetadataGetter interface {
	GetMetadata(url string) (*FileMetadata, error)
}

type S3Store struct {
	svc *s3.S3
}

func NewS3Store() (*S3Store, error) {
	endpoint := GetEnvOrDefault("AWS_ENDPOINT_URL", "")
	region := GetEnvOrDefault("AWS_REGION", DefaultAwsRegion)
	useSSL := GetBoolEnvOrDefault("AWS_USE_SSL", true)

	forcePathStyle := endpoint != ""
	awsConfig := &aws.Config{
		Region:           aws.String(region),
		Endpoint:         aws.String(endpoint),
		S3ForcePathStyle: aws.Bool(forcePathStyle),
		DisableSSL:       aws.Bool(!useSSL),
	}

	sess, err := session.NewSession(awsConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create s3 store: %w", err)
	}

	s3svc := s3.New(sess)
	return &S3Store{svc: s3svc}, nil
}

func (s *S3Store) GetMetadata(rawUrl string) (*FileMetadata, error) {
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
	return &FileMetadata{
		Size: *out.ContentLength,
		Hash: strings.Trim(*out.ETag, `"`),
	}, nil
}

var (
	ErrObjectTooLarge = errors.New("object too large")
	// ErrObjectNotFound is a missing object: a document registered for a file that was deleted
	// or moved since.
	ErrObjectNotFound = errors.New("object not found")
)

// objectError wraps an S3 error, as ErrObjectNotFound when the object is missing: GET answers
// NoSuchKey, HEAD has no body and answers NotFound.
func objectError(err error) error {
	var aerr awserr.Error
	if errors.As(err, &aerr) && (aerr.Code() == s3.ErrCodeNoSuchKey || aerr.Code() == "NotFound") {
		return fmt.Errorf("%w: %w", ErrObjectNotFound, err)
	}
	return err
}

// GetObject reads a whole object, refusing one over maxBytes before downloading it.
func (s *S3Store) GetObject(ctx context.Context, rawUrl string, maxBytes int64) ([]byte, error) {
	s3location, err := ExtractS3BucketAndKey(rawUrl)
	if err != nil {
		return nil, fmt.Errorf("locate %s: %w", rawUrl, err)
	}

	out, err := s.svc.GetObjectWithContext(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s3location.Bucket),
		Key:    aws.String(s3location.Key),
	})
	if err != nil {
		return nil, fmt.Errorf("get object %s: %w", rawUrl, objectError(err))
	}
	defer func() { _ = out.Body.Close() }()

	if aws.Int64Value(out.ContentLength) > maxBytes {
		return nil, fmt.Errorf("%s: %w", rawUrl, ErrObjectTooLarge)
	}
	data, err := io.ReadAll(io.LimitReader(out.Body, maxBytes+1))
	if err != nil {
		return nil, fmt.Errorf("read object %s: %w", rawUrl, err)
	}
	if int64(len(data)) > maxBytes {
		return nil, fmt.Errorf("%s: %w", rawUrl, ErrObjectTooLarge)
	}
	return data, nil
}

// S3Object reads byte ranges of an object, one ranged GET per ReadAt: a reader of a large
// indexed file (bigWig) fetches only the blocks it needs. io.ReaderAt takes no context, so the
// one given to OpenObject bounds every read.
type S3Object struct {
	ctx      context.Context
	svc      *s3.S3
	location *S3Location
	size     int64
}

// OpenObject reads the size of an object for ranged reads.
func (s *S3Store) OpenObject(ctx context.Context, rawUrl string) (io.ReaderAt, error) {
	s3location, err := ExtractS3BucketAndKey(rawUrl)
	if err != nil {
		return nil, fmt.Errorf("locate %s: %w", rawUrl, err)
	}
	out, err := s.svc.HeadObjectWithContext(ctx, &s3.HeadObjectInput{
		Bucket: aws.String(s3location.Bucket),
		Key:    aws.String(s3location.Key),
	})
	if err != nil {
		return nil, fmt.Errorf("head object %s: %w", rawUrl, objectError(err))
	}
	return &S3Object{ctx: ctx, svc: s.svc, location: s3location, size: aws.Int64Value(out.ContentLength)}, nil
}

func (o *S3Object) ReadAt(p []byte, off int64) (int, error) {
	if off < 0 {
		return 0, fmt.Errorf("read at negative offset %d", off)
	}
	if off >= o.size {
		return 0, io.EOF
	}
	end := min(off+int64(len(p)), o.size)
	out, err := o.svc.GetObjectWithContext(o.ctx, &s3.GetObjectInput{
		Bucket: aws.String(o.location.Bucket),
		Key:    aws.String(o.location.Key),
		Range:  aws.String(fmt.Sprintf("bytes=%d-%d", off, end-1)),
	})
	if err != nil {
		return 0, fmt.Errorf("get object range %d-%d of s3://%s/%s: %w", off, end-1, o.location.Bucket, o.location.Key, err)
	}
	defer func() { _ = out.Body.Close() }()
	n, err := io.ReadFull(out.Body, p[:end-off])
	if err != nil {
		return n, fmt.Errorf("read object range: %w", err)
	}
	if n < len(p) {
		return n, io.EOF
	}
	return n, nil
}
