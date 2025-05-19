import { AuthService } from "./AuthService";

export class ApiService {
  private static readonly BASE_URL = "https://faculty.liara.run/api";

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const token = AuthService.getAccessToken();

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

    if (response.status === 401) {
      AuthService.clearAuth();
      window.location.href = "/";
      throw new Error("Unauthorized");
    }

    return response.json();
  }
}
