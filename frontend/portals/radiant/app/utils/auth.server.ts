import { OAuth2Strategy } from "remix-auth-oauth2";
import { Authenticator } from "remix-auth";

// ref: https://github.com/sergiodxa/remix-auth-oauth2
// ref: https://www.keycloak.org/securing-apps/oidc-layers

export const AuthStrategyMame = "radiant-auth";

export const authenticator = new Authenticator();

const getKeycloakOauth2Url = (endpoint: string) =>
  `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/${endpoint}`;

authenticator.use(
  new OAuth2Strategy(
    {
      cookie: "oauth2",

      clientId: process.env.KEYCLOAK_CLIENT || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",

      tokenEndpoint: `${getKeycloakOauth2Url("token")}`,
      authorizationEndpoint: `${getKeycloakOauth2Url("auth")}`,
      // tokenRevocationEndpoint: "",

      redirectURI: `${process.env.PORTAL_HOST}/auth/callback`,

      // scopes: ["openid", "email", "profile"], // optional
      // codeChallengeMethod: CodeChallengeMethod.S256, // optional
    },
    async ({ tokens, request }) => {
      // here you can use the params above to get the user and return it
      // what you do inside this and how you find the user is up to you

      // Fetch user info
      // getKeycloakOauth2Url("userinfo")

      return tokens;
    }
  ),
  AuthStrategyMame
);
