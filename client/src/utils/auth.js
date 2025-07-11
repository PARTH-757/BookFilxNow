import {jwtDecode} from "jwt-decode";

export function getValidUserIdFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp > now) {
      return decoded.id || decoded._id || null;
    } else {
      // Token is expired
      localStorage.removeItem("token");
      return null;
    }
  } catch (error) {
    console.error("Invalid token format", error);
    localStorage.removeItem("token");
    return null;
  }
}
