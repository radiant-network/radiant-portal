package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func (r *MockRepository) GetIGV(caseID int) ([]types.IGVTrack, error) {
	return []types.IGVTrack{{
		SequencingExperimentId: 1,
		SampleId:               "sample_123",
		PatientId:              1,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "cram",
		URL:                    "s3://example.com/file.cram",
	}, {
		SequencingExperimentId: 1,
		SampleId:               "sample_123",
		PatientId:              1,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "crai",
		URL:                    "s3://example.com/file.crai",
	}}, nil
}

func Test_IGVGetHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/igv/:case_id", GetIGVHandler(repo, testutils.NewMockS3PreSigner()))

	req, _ := http.NewRequest("GET", "/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"alignment":[{"patient_id":1,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"presigned.s3://example.com/file.cram","urlExpireAt":1234567890,"indexURL":"presigned.s3://example.com/file.crai","indexURLExpireAt":1234567890,"name":"Reads: sample_123 proband"}]}`, w.Body.String())
}
