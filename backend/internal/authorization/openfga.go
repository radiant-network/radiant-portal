package authorization

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	openfga "github.com/openfga/go-sdk"
	. "github.com/openfga/go-sdk/client"
)

type CheckRequest struct {
	User     string
	Relation string
	Object   string
}

type CheckResponse struct {
	Allowed bool
}

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

	if endpoint == "" {
		return nil, fmt.Errorf("openfga: invalid endpoint: %s", endpoint)
	}

	openfgaAuthModel, err := initStore(endpoint)
	if err != nil {
		return nil, err
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
	// TODO : Validate this with KeyCloak token
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
	object := c.FullPath() // Use route path
	relation := "access"

	contextualTuples := extractContextualTuplesFromToken(token)

	allowed, err := o.check(user, object, relation, contextualTuples)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": "unexpected error during authorization check"})
		return
	}
	if !allowed {
		c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
		return
	}

	c.Next()
}

func (o *OpenFGAAuthorizer) check(user, object, relation string, contextualTuples []ClientTupleKey) (bool, error) {
	body := ClientCheckRequest{
		User:             user,
		Relation:         relation,
		Object:           object,
		ContextualTuples: contextualTuples,
	}

	authId, err := o.Client.GetAuthorizationModelId()
	if err != nil {
		return false, err
	}

	storeId, err := o.Client.GetStoreId()
	if err != nil {
		return false, err
	}

	options := ClientCheckOptions{
		AuthorizationModelId: openfga.PtrString(authId),
		StoreId:              openfga.PtrString(storeId),
	}
	data, err := o.Client.Check(context.Background()).Body(body).Options(options).Execute()
	if err != nil {
		return false, nil
	}

	return *data.Allowed, nil
}

func extractContextualTuplesFromToken(token string) []ClientContextualTupleKey {
	// TODO : Implement me
	return []ClientContextualTupleKey{}
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
