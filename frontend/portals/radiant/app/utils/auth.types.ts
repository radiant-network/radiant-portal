export const AuthStrategyName = "radiant-auth";

export interface IAuthUser {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface IAuthUserWithToken extends IAuthUser {
  refresh_token: string;
  access_token: string;
}
