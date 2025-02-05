import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};
