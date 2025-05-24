import { LoginResponse } from "../types/auth.types";
import { AccessTokenPayload, TokenPayload } from "../types/token.types";

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

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static updateTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearAuth() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static decodeToken<T extends TokenPayload>(token: string): T | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  static decodeAccessToken(): AccessTokenPayload | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.decodeToken<AccessTokenPayload>(token);
  }

  static decodeRefreshToken(): TokenPayload | null {
    const token = this.getRefreshToken();
    if (!token) return null;
    return this.decodeToken<TokenPayload>(token);
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken<TokenPayload>(token);
    if (!decoded) return true;

    // Add 30-second buffer for clock skew
    return decoded.exp * 1000 - 30000 <= Date.now();
  }

  static hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  static isAuthenticated(): boolean {
    if (this.hasValidAccessToken()) return true;

    // If access token is invalid but we have a refresh token, try to refresh
    const refreshToken = this.getRefreshToken();
    return refreshToken !== null && !this.isTokenExpired(refreshToken);
  }

  static hasFullAccess(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const decoded = AuthService.decodeToken(token);
    return decoded !== null && decoded.FullAccess === "User - FullAccess";
  }
}
