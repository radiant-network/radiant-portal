package testutils

import (
	"fmt"
	"net/url"

	"github.com/radiant-network/radiant-api/internal/utils"
)

type MockS3PreSigner struct{}

func NewMockS3PreSigner() *MockS3PreSigner {
	return &MockS3PreSigner{}
}

func (m *MockS3PreSigner) GeneratePreSignedURL(urlStr string) (*utils.PreSignedURL, error) {
	parsed, err := url.Parse(urlStr)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	if parsed.Scheme != "s3" {
		return nil, fmt.Errorf("URL is not an S3 URL")
	}

	return &utils.PreSignedURL{
		URL:         "presigned." + urlStr,
		URLExpireAt: 1234567890,
	}, nil
}
