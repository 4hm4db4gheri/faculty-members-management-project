import { LoginResponse } from "../types/auth.types";
import { decodeToken } from "../utils/jwtUtils";

export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";

  static setAuthData(response: LoginResponse) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.data.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static clearAuth() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) return false;

    // Optional: Add token expiration check
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  static hasFullAccess(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    return decoded.FullAccess === "User - FullAccess";
  }
}
