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

func assertGetSavedFilterByIDHandler(t *testing.T, repo repository.SavedFiltersDAO, savedFilterId int, status int, expected string) {
	router := gin.Default()
	router.GET("/users/saved_filters/:saved_filter_id", server.GetSavedFilterByIDHandler(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/users/saved_filters/%d", savedFilterId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetSavedFilterByIDHandler_NotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		assertGetSavedFilterByIDHandler(t, repo, 42, http.StatusNotFound, `{"status": 404, "message":"saved filter not found"}`)
	})
}

func Test_GetSavedFilterByIDHandler(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		expected := `{
			"created_on":"2021-09-12T13:08:00Z", 
			"favorite":false, 
			"id":1, 
			"name":"saved_filter_snv_1", 
			"queries":[
				{
					"content":[{"content":{"field":"chromosome", "value":["X"]}, "op":"in"}], 
					"op":"and"
				}
			], 
			"type":"germline_snv_occurrence", 
			"updated_on":"2021-09-12T13:08:00Z", 
			"user_id":"1"
		}`
		assertGetSavedFilterByIDHandler(t, repo, 1, http.StatusOK, expected)
	})
}

func assertGetSavedFilterByUserIDHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, status int, expected string) {
	router := gin.Default()
	router.GET("/users/:user_id/saved_filters", server.GetSavedFiltersByUserIDHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/users/1/saved_filters", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetSavedFilterByUserIDHandler(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		expected := `[{
			"created_on":"2021-09-12T13:08:00Z", 
			"favorite":false, 
			"id":1, 
			"name":"saved_filter_snv_1", 
			"queries":[
				{
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
			"id":2, 
			"name":"saved_filter_cnv_1", 
			"queries":[
				{
					"content":[{"content":{"field":"chromosome", "value":["1"]}, "op":"in"}], 
					"op":"and"
				}
			], 
			"type":"germline_cnv_occurrence", 
			"updated_on":"2021-09-12T13:08:00Z", 
			"user_id":"1"
		}]`
		assertGetSavedFilterByUserIDHandler(t, repo, auth, http.StatusOK, expected)
	})
}

func assertGetSavedFilterByUserIDAndTypeHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, savedFilterType types.SavedFilterType, status int, expected string) {
	router := gin.Default()
	router.GET("/users/:user_id/saved_filters/:saved_filter_type", server.GetSavedFiltersByUserIDAndTypeHandler(repo, auth))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/users/1/saved_filters/%s", savedFilterType), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetSavedFilterByUserIDAndTypeHandler(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		expected := `[{
			"created_on":"2021-09-12T13:08:00Z", 
			"favorite":false, 
			"id":1, 
			"name":"saved_filter_snv_1", 
			"queries":[
				{
					"content":[{"content":{"field":"chromosome", "value":["X"]}, "op":"in"}], 
					"op":"and"
				}
			], 
			"type":"germline_snv_occurrence", 
			"updated_on":"2021-09-12T13:08:00Z", 
			"user_id":"1"
		}]`
		assertGetSavedFilterByUserIDAndTypeHandler(t, repo, auth, types.GERMLINE_SNV_OCCURRENCE, http.StatusOK, expected)
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

func assertPutSavedFilterHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, savedFilterId int, body string, status int) {
	router := gin.Default()
	router.PUT("/users/saved_filters/:saved_filter_id", server.PutSavedFilterHandler(repo, auth))

	req, _ := http.NewRequest("PUT", fmt.Sprintf("/users/saved_filters/%d", savedFilterId), bytes.NewBuffer([]byte(body)))
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
		assertPutSavedFilterHandler(t, repo, auth, 1, body, http.StatusBadRequest)
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
		assertPutSavedFilterHandler(t, repo, auth, 42, body, http.StatusInternalServerError)
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
		assertPutSavedFilterHandler(t, repo, auth, 3, body, http.StatusInternalServerError)
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
		assertPutSavedFilterHandler(t, repo, auth, 1, body, http.StatusOK)
	})
}

func assertDeleteSavedFilterHandler(t *testing.T, repo repository.SavedFiltersDAO, auth utils.Auth, savedFilterId int, status int) {
	router := gin.Default()
	router.DELETE("/users/saved_filters/:saved_filter_id", server.DeleteSavedFilterHandler(repo, auth))

	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/users/saved_filters/%d", savedFilterId), bytes.NewBuffer([]byte("")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
}

func Test_DeleteSavedFilterHandler_NotExistingSavedFilter(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		assertDeleteSavedFilterHandler(t, repo, auth, 42, http.StatusInternalServerError)
	})
}

func Test_DeleteSavedFilterHandler_UserIdIsDifferent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		assertDeleteSavedFilterHandler(t, repo, auth, 3, http.StatusInternalServerError)
	})
}

func Test_DeleteSavedFilterHandler_Success(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSavedFiltersRepository(db)
		auth := &testutils.MockAuth{}
		assertDeleteSavedFilterHandler(t, repo, auth, 2, http.StatusNoContent)
	})
}
