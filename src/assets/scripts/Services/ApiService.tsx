import { AuthService } from "./AuthService";

interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  error: boolean;
  message: string[];
}

export class ApiService {
  private static readonly BASE_URL = "https://faculty.liara.run/api";
  private static isRefreshing = false;
  private static refreshPromise: Promise<boolean> | null = null;

  private static async refreshToken(): Promise<boolean> {
    const refreshToken = AuthService.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/panel/v1/user/refresh`, {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data: RefreshTokenResponse = await response.json();

      if (!data.error) {
        AuthService.updateTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const executeRequest = async (token: string | null) => {
      const headers: HeadersInit = {
        accept: "text/plain",
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      // Check if access token is expired before making the call
      if (
        !AuthService.hasValidAccessToken() &&
        endpoint !== "/panel/v1/user/refresh"
      ) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshToken();

          const success = await this.refreshPromise;
          this.isRefreshing = false;
          this.refreshPromise = null;

          if (success) {
            return executeRequest(AuthService.getAccessToken());
          }
        } else if (this.refreshPromise) {
          const success = await this.refreshPromise;
          if (success) {
            return executeRequest(AuthService.getAccessToken());
          }
        }

        AuthService.clearAuth();
        window.location.href = "/";
        throw new Error("Authentication failed");
      }

      if (response.status === 401) {
        AuthService.clearAuth();
        window.location.href = "/";
        throw new Error("Authentication failed");
      }

      return response.json();
    };

    return executeRequest(AuthService.getAccessToken());
  }
}
