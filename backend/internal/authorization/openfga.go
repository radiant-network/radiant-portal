package authorization

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	openfga "github.com/openfga/go-sdk"
	. "github.com/openfga/go-sdk/client"
)

type OpenFGAModelConfiguration struct {
	Endpoint             string
	StoreID              string
	AuthorizationModelID string
}

type OpenFGAAuthorizer struct {
	Client *OpenFgaClient
}

func NewOpenFGAAuthorizer() (gin.HandlerFunc, error) {
	endpoint := os.Getenv("RADIANT_AUTHORIZATION_OPENFGA_ENDPOINT")
	storeId := os.Getenv("RADIANT_AUTHORIZATION_OPENFGA_STORE_ID")

	if endpoint == "" {
		return nil, fmt.Errorf("openfga: invalid endpoint: %s", endpoint)
	}

	var openfgaAuthModel *OpenFGAModelConfiguration
	var err error

	if storeId != "" {
		log.Printf("openfga: using existing store id: %s", storeId)
		openfgaAuthModel = &OpenFGAModelConfiguration{
			Endpoint: endpoint,
			StoreID:  storeId,
		}
	} else {
		log.Print("openfga: no store id specified, initializing new store and model")
		openfgaAuthModel, err = initStore(endpoint)
		if err != nil {
			return nil, err
		}
	}

	client, err := NewSdkClient(&ClientConfiguration{
		ApiUrl:               endpoint,
		StoreId:              openfgaAuthModel.StoreID,
		AuthorizationModelId: openfgaAuthModel.AuthorizationModelID,
	})
	if err != nil {
		return nil, err
	}

	o := OpenFGAAuthorizer{
		Client: client,
	}

	return o.Authorize, nil
}

func (o *OpenFGAAuthorizer) Authorize(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.AbortWithStatusJSON(401, gin.H{"error": "missing authorization token"})
		return
	}

	parsedToken, err := parseJWT(token)
	if err != nil {
		c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
		return
	}

	user := parsedToken["sub"].(string)
	if user == "" {
		c.AbortWithStatusJSON(401, gin.H{"error": "invalid sub claim"})
		return
	}

	contextualTuples := extractContextualTuplesFromToken(parsedToken)
	relation := extractRelation(c.Request)

	allowed, err := o.listRelations(user, "project", relation, contextualTuples)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": "unexpected error during authorization check"})
		return
	}
	if len(allowed) == 0 {
		c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
		return
	}

	c.Next()
}

func (o *OpenFGAAuthorizer) listRelations(user, relType, relation string, contextualTuples []ClientTupleKey) ([]string, error) {
	body := ClientListObjectsRequest{
		User:             fmt.Sprintf("user:%s", user),
		Relation:         relation,
		Type:             relType,
		ContextualTuples: contextualTuples,
	}

	authId, err := o.Client.GetAuthorizationModelId()
	if err != nil {
		return nil, err
	}

	storeId, err := o.Client.GetStoreId()
	if err != nil {
		return nil, err
	}

	options := ClientListObjectsOptions{
		AuthorizationModelId: openfga.PtrString(authId),
		StoreId:              openfga.PtrString(storeId),
	}
	data, err := o.Client.ListObjects(context.Background()).Body(body).Options(options).Execute()
	if err != nil {
		return nil, nil
	}

	return data.Objects, nil
}

func extractRelation(r *http.Request) string {
	method := strings.ToLower(r.Method)
	path := strings.ReplaceAll(r.URL.Path, "/", "_")
	return fmt.Sprintf("%s_%s", method, path)
}

func extractContextualTuplesFromToken(jwtClaims jwt.MapClaims) []ClientContextualTupleKey {
	var contextualTuples []ClientContextualTupleKey

	sub := jwtClaims["sub"].(string)
	if sub == "" {
		log.Printf("openfga: missing sub claim")
		return contextualTuples
	}

	azp := jwtClaims["azp"].(string)
	if azp == "" {
		log.Printf("openfga: missing azp claim")
		return contextualTuples
	}

	resourceAccess, ok := jwtClaims["resource_access"].(map[string]interface{})
	if !ok {
		log.Printf("openfga: missing resource_access claim")
		return contextualTuples
	}

	for resource, access := range resourceAccess {
		if resource == "account" {
			// Skip default Keycloak account resource
			continue
		}

		roles, ok := access.(map[string]interface{})
		if !ok {
			log.Printf("openfga: invalid resource %s", resource)
			continue
		}
		roleList, ok := roles["roles"].([]interface{})
		if !ok {
			log.Printf("openfga: no roles for resource %s", resource)
			continue
		}

		for _, role := range roleList {
			if azp == resource {
				// Application (client) level role
				contextualTuples = append(contextualTuples, ClientContextualTupleKey{
					Object:   fmt.Sprintf("application:%s", resource),
					Relation: role.(string),
					User:     fmt.Sprintf("user:%s", sub),
				})
			} else {
				// Project level role
				contextualTuples = append(contextualTuples, ClientContextualTupleKey{
					Object:   fmt.Sprintf("project:%s", resource),
					Relation: role.(string),
					User:     fmt.Sprintf("user:%s", sub),
				})
			}
		}
	}

	return contextualTuples
}

func initStore(endpoint string) (*OpenFGAModelConfiguration, error) {
	modelPath := os.Getenv("RADIANT_AUTHORIZATION_OPENFGA_MODEL_PATH")
	modelBytes, err := os.ReadFile(modelPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read model file: %w", err)
	}

	var body openfga.WriteAuthorizationModelRequest
	if err := json.Unmarshal(modelBytes, &body); err != nil {
		return nil, err
	}

	clientConfig := &ClientConfiguration{ApiUrl: endpoint}
	fgaClient, err := NewSdkClient(clientConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create OpenFGA client: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	storeResp, err := fgaClient.CreateStore(ctx).
		Body(ClientCreateStoreRequest{Name: "default-store"}).
		Execute()
	if err != nil {
		return nil, fmt.Errorf("failed to create store: %w", err)
	}
	storeID := storeResp.GetId()
	if storeID == "" {
		return nil, fmt.Errorf("store id empty in response")
	}

	options := ClientWriteAuthorizationModelOptions{
		StoreId: openfga.PtrString(storeID),
	}

	data, err := fgaClient.WriteAuthorizationModel(context.Background()).Options(options).Body(body).Execute()
	if err != nil {
		return nil, fmt.Errorf("failed to write authorization model: %w", err)
	}

	return &OpenFGAModelConfiguration{
		Endpoint:             endpoint,
		StoreID:              storeID,
		AuthorizationModelID: data.AuthorizationModelId,
	}, nil
}

func parseJWT(tokenString string) (jwt.MapClaims, error) {
	token := strings.TrimPrefix(strings.TrimSpace(tokenString), "Bearer ")
	claims := jwt.MapClaims{}
	_, _, err := new(jwt.Parser).ParseUnverified(token, claims)
	return claims, err
}
