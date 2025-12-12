package testutils

import (
	"github.com/radiant-network/radiant-api/internal/utils"
)

type MockS3PreSigner struct{}

func (m *MockS3PreSigner) GenerateS3PreSignedURL(url string) (*utils.PreSignedURL, error) {
	return &utils.PreSignedURL{
		URL:         "presigned." + url,
		URLExpireAt: 1234567890,
	}, nil
}
