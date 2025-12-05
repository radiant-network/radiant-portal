package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func assertGetSequencing(t *testing.T, data string, seqId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSequencingRepository(db)
		router := gin.Default()
		router.GET("/sequencing/:seq_id", server.GetSequencing(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/sequencing/%d", seqId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetSequencing(t *testing.T) {
	expected := `{"affected_status":"affected", "analysis_type":"germline", "experimental_strategy":"WGS", "part":1, "seq_id":1, "task_id":1}`
	assertGetSequencing(t, "simple", 1, expected)
}
