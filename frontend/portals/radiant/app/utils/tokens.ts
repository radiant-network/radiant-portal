import { jwtDecode } from 'jwt-decode';

/** `minValiditySeconds`: count a token expiring within that delay as already expired. */
export const isTokenValid = (token: string, minValiditySeconds = 0) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime + minValiditySeconds;
  } catch (error) {
    return false;
  }
};
