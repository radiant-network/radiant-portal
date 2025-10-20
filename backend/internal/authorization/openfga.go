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
	openfga "github.com/openfga/go-sdk"
	. "github.com/openfga/go-sdk/client"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

const AllowedContextKey = "allowed"
const ProjectRelationType = "project"

type OpenFGAModelConfiguration struct {
	Endpoint             string
	StoreID              string
	AuthorizationModelID string
}

type OpenFGAAuthorizer struct {
	Client *OpenFgaClient
	Auth   *utils.KeycloakAuth
}

func NewOpenFGAAuthorizer(auth *utils.KeycloakAuth) (gin.HandlerFunc, error) {
	endpoint := os.Getenv("RADIANT_AUTHORIZATION_OPENFGA_ENDPOINT")
	modelPath := os.Getenv("RADIANT_AUTHORIZATION_OPENFGA_MODEL_PATH")
	storeId := os.Getenv("RADIANT_AUTHORIZATION_OPENFGA_STORE_ID")

	if endpoint == "" {
		return nil, fmt.Errorf("openfga: invalid endpoint: %s", endpoint)
	}
	if modelPath == "" && storeId == "" {
		return nil, fmt.Errorf("openfga: either model path or store id must be specified")
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
		openfgaAuthModel, err = InitOpenFGAStore(endpoint, modelPath)
		if err != nil {
			return nil, fmt.Errorf("openfga: error initializing store model: %v", err)
		}
	}

	client, err := NewSdkClient(&ClientConfiguration{
		ApiUrl:               endpoint,
		StoreId:              openfgaAuthModel.StoreID,
		AuthorizationModelId: openfgaAuthModel.AuthorizationModelID,
	})
	if err != nil {
		return nil, fmt.Errorf("openfga: error initializing openfga client: %w", err)
	}

	o := OpenFGAAuthorizer{
		Client: client,
		Auth:   auth,
	}

	return o.Authorize, nil
}

func (o *OpenFGAAuthorizer) Authorize(c *gin.Context) {

	user, err := o.Auth.RetrieveUserIdFromToken(c)
	if err != nil || user == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, nil)
		return
	}

	azp, err := o.Auth.RetrieveAzpFromToken(c)
	if err != nil || azp == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, nil)
		return
	}

	res, err := o.Auth.RetrieveResourceAccessFromToken(c)
	if err != nil || res == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, nil)
		return
	}

	contextualTuples := extractContextualTuples(*user, *azp, *res)
	relation, err := extractRelation(c.Request, c.FullPath())
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, nil)
		return
	}

	allowed, err := o.listRelations(*user, ProjectRelationType, relation, contextualTuples)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, nil)
		return
	}
	if len(allowed) == 0 {
		c.AbortWithStatusJSON(http.StatusForbidden, nil)
		return
	}

	c.Set(AllowedContextKey, allowed)
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
		return nil, fmt.Errorf("openfga: error listing objects: %w", err)
	}

	return data.Objects, nil
}

func extractRelation(r *http.Request, fullPath string) (string, error) {
	role := map[string]string{
		"GET":    "reader",
		"POST":   "writer",
		"PUT":    "writer",
		"PATCH":  "writer",
		"DELETE": "writer",
	}[strings.ToUpper(r.Method)]

	if role == "" {
		return "", fmt.Errorf("openfga: unsupported method: %s", r.Method)
	}

	scope := strings.Split(strings.TrimPrefix(fullPath, "/"), "/")[0]
	return fmt.Sprintf("%s_%s", scope, role), nil
}

func extractContextualTuples(user, azp string, resourceAccess map[string]ginkeycloak.ServiceRole) []ClientContextualTupleKey {
	var contextualTuples []ClientContextualTupleKey

	for resource, access := range resourceAccess {
		if resource == "account" {
			// Skip default Keycloak account resource
			continue
		}

		for _, role := range access.Roles {
			if azp == resource {
				// Application (client) level role
				contextualTuples = append(contextualTuples, ClientContextualTupleKey{
					Object:   fmt.Sprintf("application:%s", resource),
					Relation: role,
					User:     fmt.Sprintf("user:%s", user),
				})
			} else {
				// Project level role
				contextualTuples = append(contextualTuples, ClientContextualTupleKey{
					Object:   fmt.Sprintf("project:%s", resource),
					Relation: role,
					User:     fmt.Sprintf("user:%s", user),
				})
			}
		}
	}

	return contextualTuples
}

func InitOpenFGAStore(endpoint, modelPath string) (*OpenFGAModelConfiguration, error) {
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
