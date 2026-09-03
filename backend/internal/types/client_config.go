package types

const ClientAuthMethodDevice = "device"

// @Description Public configuration a command-line client needs before any authenticated call.
type ClientConfig struct {
	Auth ClientAuthConfig `json:"auth" validate:"required"`
} // @name ClientConfig

// @Description Public Keycloak settings for the OAuth2 device authorization grant.
type ClientAuthConfig struct {
	Method      string `json:"method" validate:"required" example:"device"`
	KeycloakURL string `json:"keycloak_url" validate:"required" example:"https://auth.example.org"`
	Realm       string `json:"realm" validate:"required" example:"radiant"`
	ClientID    string `json:"client_id" validate:"required" example:"radiant-client-cli"`
} // @name ClientAuthConfig
