import { LoginResponse } from "../types/auth.types";
import { decodeToken } from '../utils/jwtUtils';

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
    return !!this.getAccessToken();
  }

  static hasFullAccess(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    const decoded = decodeToken(token);
    return decoded.FullAccess === 'User - FullAccess';
  }
}
