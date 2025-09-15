package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetSavedFilterByID(savedFilterId int) (*types.SavedFilter, error) {
	return &types.SavedFilter{
		ID:       1,
		UserID:   "1",
		Name:     "saved_filter_snv_1",
		Type:     types.GERMLINE_SNV_OCCURRENCE,
		Favorite: false,
		CreatedOn: time.Date(
			2021, 9, 12, 13, 8, 0, 0, time.UTC),
		UpdatedOn: time.Date(
			2021, 9, 12, 13, 8, 0, 0, time.UTC),
		Queries: types.JsonArray[types.Sqon]{
			{
				Op: "and",
				Content: types.SqonArray{
					{
						Op: "in",
						Content: types.LeafContent{
							Field: "chromosome",
							Value: []interface{}{"1"},
						},
					},
				},
			},
		},
	}, nil
}

func (m *MockRepository) GetSavedFiltersByUserID(userId string) (*[]types.SavedFilter, error) {
	return &[]types.SavedFilter{
		{
			ID:       1,
			UserID:   "1",
			Name:     "saved_filter_snv_1",
			Type:     types.GERMLINE_SNV_OCCURRENCE,
			Favorite: false,
			CreatedOn: time.Date(
				2021, 9, 12, 13, 8, 0, 0, time.UTC),
			UpdatedOn: time.Date(
				2021, 9, 12, 13, 8, 0, 0, time.UTC),
			Queries: types.JsonArray[types.Sqon]{
				{
					Op: "and",
					Content: types.SqonArray{
						{
							Op: "in",
							Content: types.LeafContent{
								Field: "chromosome",
								Value: []interface{}{"1"},
							},
						},
					},
				},
			},
		},
		{
			ID:       2,
			UserID:   "1",
			Name:     "saved_filter_cnv_1",
			Type:     types.GERMLINE_CNV_OCCURRENCE,
			Favorite: true,
			CreatedOn: time.Date(
				2021, 9, 12, 13, 8, 0, 0, time.UTC),
			UpdatedOn: time.Date(
				2021, 9, 12, 13, 8, 0, 0, time.UTC),
			Queries: types.JsonArray[types.Sqon]{
				{
					Op: "and",
					Content: types.SqonArray{
						{
							Op: "in",
							Content: types.LeafContent{
								Field: "chromosome",
								Value: []interface{}{"1"},
							},
						},
					},
				},
			},
		},
	}, nil
}

func (m *MockRepository) GetSavedFiltersByUserIDAndType(userId string, savedFilterType string) (*[]types.SavedFilter, error) {
	return &[]types.SavedFilter{
		{
			ID:       1,
			UserID:   "1",
			Name:     "saved_filter_snv_1",
			Type:     types.GERMLINE_SNV_OCCURRENCE,
			Favorite: false,
			CreatedOn: time.Date(
				2021, 9, 12, 13, 8, 0, 0, time.UTC),
			UpdatedOn: time.Date(
				2021, 9, 12, 13, 8, 0, 0, time.UTC),
			Queries: types.JsonArray[types.Sqon]{
				{
					Op: "and",
					Content: types.SqonArray{
						{
							Op: "in",
							Content: types.LeafContent{
								Field: "chromosome",
								Value: []interface{}{"1"},
							},
						},
					},
				},
			},
		},
	}, nil
}

func (m *MockRepository) CreateSavedFilter(savedFilterInput types.SavedFilterCreationInput, userId string) (*types.SavedFilter, error) {
	return &types.SavedFilter{
		ID:       1,
		UserID:   userId,
		Name:     savedFilterInput.Name,
		Type:     savedFilterInput.Type,
		Favorite: false,
		CreatedOn: time.Date(
			2021, 9, 12, 13, 8, 0, 0, time.UTC),
		UpdatedOn: time.Date(
			2021, 9, 12, 13, 8, 0, 0, time.UTC),
		Queries: savedFilterInput.Queries,
	}, nil
}

func Test_GetSavedFilterByIDHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/users/saved_filters/:saved_filter_id", GetSavedFilterByIDHandler(repo))

	req, _ := http.NewRequest("GET", "/users/saved_filters/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"created_on":"2021-09-12T13:08:00Z", 
		"favorite":false, 
		"id":1, 
		"name":"saved_filter_snv_1", 
		"queries":[
			{
				"content":[{"content":{"field":"chromosome", "value":["1"]}, "op":"in"}], 
				"op":"and"
			}
		], 
		"type":"germline_snv_occurrence", 
		"updated_on":"2021-09-12T13:08:00Z", 
		"user_id":"1"
	}`, w.Body.String())
}

func Test_GetSavedFiltersByUserIDHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.GET("/users/:user_id/saved_filters", GetSavedFiltersByUserIDHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/users/1/saved_filters", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"created_on":"2021-09-12T13:08:00Z", 
		"favorite":false, 
		"id":1, 
		"name":"saved_filter_snv_1", 
		"queries":[
			{
				"content":[{"content":{"field":"chromosome", "value":["1"]}, "op":"in"}], 
				"op":"and"
			}
		], 
		"type":"germline_snv_occurrence", 
		"updated_on":"2021-09-12T13:08:00Z", 
		"user_id":"1"
	}, {
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
	}]`, w.Body.String())
}

func Test_GetSavedFiltersByUserIDAndTypeHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.GET("/users/:user_id/saved_filters/:saved_filter_type", GetSavedFiltersByUserIDAndTypeHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/users/1/saved_filters/germline-snv-occurrence", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"created_on":"2021-09-12T13:08:00Z", 
		"favorite":false, 
		"id":1, 
		"name":"saved_filter_snv_1", 
		"queries":[
			{
				"content":[{"content":{"field":"chromosome", "value":["1"]}, "op":"in"}], 
				"op":"and"
			}
		], 
		"type":"germline_snv_occurrence", 
		"updated_on":"2021-09-12T13:08:00Z", 
		"user_id":"1"
	}]`, w.Body.String())
}

func Test_PostSavedFilterHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/users/saved_filters", PostSavedFilterHandler(repo, auth))

	body := `{
			"name": "new_saved_filter",
			"type": "somatic_snv_variant",
			"queries": []
	}`
	req, _ := http.NewRequest("POST", "/users/saved_filters", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.JSONEq(t, `{
		"created_on":"2021-09-12T13:08:00Z", 
		"favorite":false, 
		"id":1, 
		"name":"new_saved_filter", 
		"queries":[], 
		"type":"somatic_snv_variant", 
		"updated_on":"2021-09-12T13:08:00Z", 
		"user_id":"1"
	}`, w.Body.String())
}

func Test_PostSavedFilterHandler_InvalidType(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/users/saved_filters", PostSavedFilterHandler(repo, auth))

	body := `{
			"name": "new_saved_filter",
			"type": "not_a_valid_type",
			"queries": []
	}`
	req, _ := http.NewRequest("POST", "/users/saved_filters", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostSavedFilterHandler_MissingField(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/users/saved_filters", PostSavedFilterHandler(repo, auth))

	body := `{
			"type": "somatic_snv_variant",
			"queries": []
	}`
	req, _ := http.NewRequest("POST", "/users/saved_filters", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
