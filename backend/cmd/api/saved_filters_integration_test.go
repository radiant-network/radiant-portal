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
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func assertGetSavedFilterByIDHandler(t *testing.T, repo repository.SavedFiltersDAO, savedFilterId string, status int, expected string) {
	router := gin.Default()
	router.GET("/users/saved_filters/:saved_filter_id", server.GetSavedFilterByIDHandler(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/users/saved_filters/%s", savedFilterId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetSavedFilterByIDHandler_NotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		assertGetSavedFilterByIDHandler(t, repo, "ac2df672-9702-4dcf-8cfd-457494384762", http.StatusNotFound, `{"status": 404, "message":"saved filter not found"}`)
	})
}

func Test_GetSavedFilterByIDHandler(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		expected := `{
			"created_on":"2021-09-12T13:08:00Z", 
			"favorite":false, 
			"id":"1e1c5bc3-4f65-496a-ad61-cab239bf72d5", 
			"name":"saved_filter_snv_1", 
			"queries":[
				{
					"id": "193de905-b6f2-4fd8-ac51-c92d9f3f4bb5",
					"content":[{"content":{"field":"chromosome", "value":["X"]}, "op":"in"}], 
					"op":"and"
				}
			], 
			"type":"germline_snv_occurrence", 
			"updated_on":"2021-09-12T13:08:00Z", 
			"user_id":"1"
		}`
		assertGetSavedFilterByIDHandler(t, repo, "1e1c5bc3-4f65-496a-ad61-cab239bf72d5", http.StatusOK, expected)
	})
}

func assertGetSavedFiltersHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, savedFilterType *types.SavedFilterType, status int, expected string) {
	router := gin.Default()
	router.GET("/users/saved_filters", server.GetSavedFiltersHandler(repo, auth))

	var req *http.Request
	if savedFilterType != nil {
		req, _ = http.NewRequest("GET", fmt.Sprintf("/users/saved_filters?type=%s", *savedFilterType), bytes.NewBuffer([]byte("{}")))
	} else {
		req, _ = http.NewRequest("GET", "/users/saved_filters", bytes.NewBuffer([]byte("{}")))
	}
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetSavedFiltersHandler(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		expected := `[{
			"created_on":"2021-09-12T13:08:00Z", 
			"favorite":false, 
			"id":"1e1c5bc3-4f65-496a-ad61-cab239bf72d5", 
			"name":"saved_filter_snv_1", 
			"queries":[
				{
					"id": "193de905-b6f2-4fd8-ac51-c92d9f3f4bb5",
					"content":[{"content":{"field":"chromosome", "value":["X"]}, "op":"in"}], 
					"op":"and"
				}
			], 
			"type":"germline_snv_occurrence", 
			"updated_on":"2021-09-12T13:08:00Z", 
			"user_id":"1"
		},{
			"created_on":"2021-09-12T13:08:00Z", 
			"favorite":true, 
			"id": "bef3b28c-9ead-4793-99a9-4a4f905faaed", 
			"name":"saved_filter_cnv_1", 
			"queries":[
				{
					"id": "193de905-b6f2-4fd8-ac51-c92d9f3f4bb5",
					"content":[{"content":{"field":"chromosome", "value":["1"]}, "op":"in"}], 
					"op":"and"
				}
			], 
			"type":"germline_cnv_occurrence", 
			"updated_on":"2021-09-12T13:08:00Z", 
			"user_id":"1"
		}]`
		assertGetSavedFiltersHandler(t, repo, auth, nil, http.StatusOK, expected)
	})
}

func Test_GetSavedFiltersHandler_FilterOnType(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		savedFilterType := types.GERMLINE_SNV_OCCURRENCE
		expected := `[{
			"created_on":"2021-09-12T13:08:00Z", 
			"favorite":false, 
			"id":"1e1c5bc3-4f65-496a-ad61-cab239bf72d5", 
			"name":"saved_filter_snv_1", 
			"queries":[
				{
					"id": "193de905-b6f2-4fd8-ac51-c92d9f3f4bb5",
					"content":[{"content":{"field":"chromosome", "value":["X"]}, "op":"in"}], 
					"op":"and"
				}
			], 
			"type":"germline_snv_occurrence", 
			"updated_on":"2021-09-12T13:08:00Z", 
			"user_id":"1"
		}]`
		assertGetSavedFiltersHandler(t, repo, auth, &savedFilterType, http.StatusOK, expected)
	})
}

func assertPostSavedFilterHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, body string, status int) {
	router := gin.Default()
	router.POST("/users/saved_filters", server.PostSavedFilterHandler(repo, auth))

	req, _ := http.NewRequest("POST", "/users/saved_filters", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
}

func Test_PostSavedFilterHandler_ErrorDuplicateName(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		body := `{
			"name": "saved_filter_snv_1",
			"type": "germline_snv_occurrence",
			"queries": []
		}`
		assertPostSavedFilterHandler(t, repo, auth, body, http.StatusInternalServerError)
	})
}

func Test_PostSavedFilterHandler_InvalidInput(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		body := `{
			"name": "saved_filter_snv_11",
			"type": "invalid_type",
			"queries": []
		}`
		assertPostSavedFilterHandler(t, repo, auth, body, http.StatusBadRequest)
	})
}

func Test_PostSavedFilterHandler_Success(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		body := `{
			"name": "saved_filter_snv_11",
			"type": "somatic_snv_occurrence",
			"queries": []
		}`
		assertPostSavedFilterHandler(t, repo, auth, body, http.StatusCreated)
	})
}

func assertPutSavedFilterHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, savedFilterId string, body string, status int) {
	router := gin.Default()
	router.PUT("/users/saved_filters/:saved_filter_id", server.PutSavedFilterHandler(repo, auth))

	req, _ := http.NewRequest("PUT", fmt.Sprintf("/users/saved_filters/%s", savedFilterId), bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
}

func Test_PutSavedFilterHandler_InvalidInput(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		body := `{
			"name": "saved_filter_snv_11",
			"queries": []
		}`
		assertPutSavedFilterHandler(t, repo, auth, "193de905-b6f2-4fd8-ac51-c92d9f3f4bb5", body, http.StatusBadRequest)
	})
}

func Test_PutSavedFilterHandler_NotExistingSavedFilter(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		body := `{
			"favorite": true,
			"name": "saved_filter_snv_11",
			"queries": []
		}`
		assertPutSavedFilterHandler(t, repo, auth, "ac2df672-9702-4dcf-8cfd-457494384762", body, http.StatusNotFound)
	})
}

func Test_PutSavedFilterHandler_UserIdIsDifferent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		body := `{
			"favorite": true,
			"name": "saved_filter_snv_11",
			"queries": []
		}`
		assertPutSavedFilterHandler(t, repo, auth, "193de905-b6f2-4fd8-ac51-c92d9f3f4bb5", body, http.StatusNotFound)
	})
}

func Test_PutSavedFilterHandler_Success(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		body := `{
			"favorite": true,
			"name": "saved_filter_snv_1.1",
			"queries": []
		}`
		assertPutSavedFilterHandler(t, repo, auth, "1e1c5bc3-4f65-496a-ad61-cab239bf72d5", body, http.StatusOK)
	})
}

func assertDeleteSavedFilterHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, savedFilterId string, status int) {
	router := gin.Default()
	router.DELETE("/users/saved_filters/:saved_filter_id", server.DeleteSavedFilterHandler(repo, auth))

	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/users/saved_filters/%s", savedFilterId), bytes.NewBuffer([]byte("")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
}

func Test_DeleteSavedFilterHandler_NotExistingSavedFilter(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		assertDeleteSavedFilterHandler(t, repo, auth, "ac2df672-9702-4dcf-8cfd-457494384762", http.StatusNotFound)
	})
}

func Test_DeleteSavedFilterHandler_UserIdIsDifferent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		assertDeleteSavedFilterHandler(t, repo, auth, "dddfa647-b0df-4ce7-807d-5b8775ee8fcb", http.StatusNotFound)
	})
}

func Test_DeleteSavedFilterHandler_Success(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		assertDeleteSavedFilterHandler(t, repo, auth, "1e1c5bc3-4f65-496a-ad61-cab239bf72d5", http.StatusNoContent)
	})
}
