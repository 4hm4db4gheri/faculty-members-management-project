import { LoginResponse } from "../types/auth.types";
import { decodeToken } from "../utils/jwtUtils";

export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_DATA_KEY = "userData";

  static setAuthData(response: LoginResponse) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.data.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.data.refreshToken);
    localStorage.setItem(
      this.USER_DATA_KEY,
      JSON.stringify({
        phoneNumber: response.data.phoneNumber,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
      }),
    );
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static clearAuth() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decoded = decodeToken(token);
      // Check if the token has an expiration time (exp) and if it's in the future
      if (decoded && decoded.exp) {
        const currentTime = Date.now() / 1000; // current time in seconds
        return decoded.exp > currentTime; // Token is valid if expiration time is in the future
      }
      return false; // No expiration time or invalid decoded token
    } catch (error) {
      console.error("Error checking token validity:", error);
      this.clearAuth(); // Clear invalid token
      return false;
    }
  }

  static hasFullAccess(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // First, check if the token is authenticated and not expired
    if (!this.isAuthenticated()) return false; // Re-use the isAuthenticated logic

    const decoded = decodeToken(token);
    return decoded.FullAccess === "User - FullAccess";
  }
}
