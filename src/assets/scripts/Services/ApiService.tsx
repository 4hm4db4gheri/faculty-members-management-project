import { AuthService } from "./AuthService";

export class ApiService {
  private static readonly BASE_URL = "https://faculty.liara.run/api";

  private static async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      AuthService.clearAuth();
      window.location.href = "/";
      throw new Error("Unauthorized");
    }

    // Try to get content length; if 0, assume empty body and return empty array/object
    const contentLength = response.headers.get("Content-Length");
    if (contentLength === "0") {
      // If content length is 0, return an empty array as a default for chart data APIs
      // This assumes ChartDataItem1[] and ChartDataItem2[] are array types
      return [] as T;
    }

    try {
      const text = await response.text();
      // If the text is empty, return an empty array or object based on expected type
      if (!text.trim()) {
        return [] as T; // Default to empty array for chart data
      }
      return JSON.parse(text) as T;
    } catch (error) {
      // If JSON parsing fails, log the error and return an empty array
      console.error("Error parsing JSON response:", error);
      return [] as T; // Default to empty array
    }
  }

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

    return this.parseResponse<T>(response);
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

    // For empty responses, return a default response that matches the expected type
    // This part of `put` already handles empty text, so we'll keep it similar.
    const text = await response.text();
    return text
      ? JSON.parse(text)
      : ({ data: null, error: false, message: [] } as T);
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

    return this.parseResponse<T>(response);
  }
}
