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

  static async put<T>(endpoint: string): Promise<T> {
    const token = AuthService.getAccessToken();

    const headers: HeadersInit = {
      accept: "text/plain",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
    });

    if (response.status === 401) {
      AuthService.clearAuth();
      window.location.href = "/";
      throw new Error("Unauthorized");
    }

    // For empty responses, return a default response that matches the expected type
    const text = await response.text();
    return text ? JSON.parse(text) : { data: null, error: false, message: [] } as T;
  }

  static async get<T>(endpoint: string): Promise<T> {
    const token = AuthService.getAccessToken();

    const headers: HeadersInit = {
      accept: "text/plain",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (response.status === 401) {
      AuthService.clearAuth();
      window.location.href = "/";
      throw new Error("Unauthorized");
    }

    return response.json();
  }
}
