import { AuthService } from "./AuthService";

export class ApiService {
  private static readonly BASE_URLS = ["https://backend.samaah.ir/api"];

  private static currentBaseUrlIndex = 0;

  private static getCurrentBaseUrl(): string {
    return this.BASE_URLS[this.currentBaseUrlIndex];
  }

  private static async tryNextUrl(): Promise<void> {
    this.currentBaseUrlIndex =
      (this.currentBaseUrlIndex + 1) % this.BASE_URLS.length;
    console.log(`Trying next URL: ${this.getCurrentBaseUrl()}`);
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

    const maxRetries = this.BASE_URLS.length;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.getCurrentBaseUrl()}${endpoint}`, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });

        if (response.status === 401) {
          AuthService.clearAuth();
          window.location.href = "/";
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.error(
          `API Error for ${endpoint} (attempt ${attempt + 1}):`,
          error,
        );
        lastError = error as Error;

        if (attempt < maxRetries - 1) {
          await this.tryNextUrl();
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    // If all attempts failed, throw the last error
    throw lastError || new Error("All API endpoints failed");
  }

  static async put<T>(endpoint: string): Promise<T> {
    const token = AuthService.getAccessToken();

    const headers: HeadersInit = {
      accept: "text/plain",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.getCurrentBaseUrl()}${endpoint}`, {
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
    return text
      ? JSON.parse(text)
      : ({ data: null, error: false, message: [] } as T);
  }

  static async get<T>(endpoint: string): Promise<T> {
    const token = AuthService.getAccessToken();

    const headers: HeadersInit = {
      accept: "text/plain",
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const maxRetries = this.BASE_URLS.length;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const currentUrl = `${this.getCurrentBaseUrl()}${endpoint}`;
        console.log(
          `Attempting API call (${attempt + 1}/${maxRetries}): ${currentUrl}`,
        );

        const response = await fetch(currentUrl, {
          method: "GET",
          headers,
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        console.log(
          `Response status: ${response.status} ${response.statusText}`,
        );

        if (response.status === 401) {
          AuthService.clearAuth();
          window.location.href = "/";
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP Error ${response.status}: ${errorText}`);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`,
          );
        }

        const responseText = await response.text();
        console.log(`Response body: ${responseText}`);

        return responseText ? JSON.parse(responseText) : ({} as T);
      } catch (error) {
        console.error(
          `API Error for ${endpoint} (attempt ${attempt + 1}):`,
          error,
        );
        lastError = error as Error;

        if (attempt < maxRetries - 1) {
          await this.tryNextUrl();
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    // If all attempts failed, throw the last error
    throw lastError || new Error("All API endpoints failed");
  }
}
