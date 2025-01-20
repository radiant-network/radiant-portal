import { OAuth2Strategy } from "remix-auth-oauth2";
import { Authenticator } from "remix-auth";
import { createCookieSessionStorage, redirect } from "react-router";
import {
  AuthStrategyName,
  type IAuthUser,
  type IAuthUserWithToken,
} from "./auth.types";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

export const getKeycloakOauth2Url = (endpoint: string) =>
  `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/${endpoint}`;

export const authenticateRequest = async (
  request: Request
): Promise<IAuthUserWithToken> =>
  await authenticator.authenticate(AuthStrategyName, request);

export const getSessionUser = async (request: Request): Promise<IAuthUser> => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  return user;
};

export const login = async (request: Request): Promise<Response> => {
  const { refresh_token, ...user } = await authenticateRequest(request);

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  session.set("user", user);
  session.set("r_token", refresh_token);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
      "Cache-Control": "no-store",
    },
  });
};

export const logout = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  await fetch(getKeycloakOauth2Url("logout"), {
    method: "POST",
    body: new URLSearchParams({
      refresh_token: session.get("r_token"),
      client_id: process.env.KEYCLOAK_CLIENT!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
    }).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
      "Cache-Control": "no-store",
    },
  });
};

export const requireAuth = async (request: Request): Promise<boolean> => {
  return !(await getSessionUser(request));
};

export const authenticator = new Authenticator<IAuthUserWithToken>();

authenticator.use(
  new OAuth2Strategy(
    {
      cookie: "oauth2",

      clientId: process.env.KEYCLOAK_CLIENT || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",

      tokenEndpoint: `${getKeycloakOauth2Url("token")}`,
      authorizationEndpoint: `${getKeycloakOauth2Url("auth")}`,

      redirectURI: `${process.env.PORTAL_HOST}/auth/callback`,

      scopes: ["openid", "email", "profile"], // optional
    },
    async ({ tokens }) => {
      const response = await fetch(getKeycloakOauth2Url("userinfo"), {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      });

      const userInfo = await response.json();

      return {
        ...userInfo,
        refresh_token: tokens.refreshToken(),
      };
    }
  ),
  AuthStrategyName
);
