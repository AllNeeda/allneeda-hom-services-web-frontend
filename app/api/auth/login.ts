// app/api/auth.ts
import { api, tokenManager } from "@/app/api/axios";

export interface User {
  _id: string;
  email: string;
  username: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  code?: string;
}

class AuthService {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const { accessToken, refreshToken } = response.data.tokens;
      const { user } = response.data;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      if (!refreshToken) {
        throw new Error("No refresh token received from server");
      }

      // Store tokens in cookies (accessible by middleware)
      await tokenManager.setTokens(accessToken, refreshToken);

      return { user, tokens: { accessToken, refreshToken } };
    } catch (error: any) {
      // Enhanced error handling with specific error codes
      if (error.response) {
        const serverError: ApiError = {
          message: error.response.data?.message || "Login failed",
          statusCode: error.response.status,
          error: error.response.data?.error,
          code: error.response.data?.code,
        };

        switch (error.response.status) {
          case 400:
            serverError.message =
              error.response.data?.message || "Invalid request format";
            break;
          case 401:
            serverError.message = "Invalid email or password";
            break;
          case 403:
            serverError.message = "Account suspended or access restricted";
            break;
          case 404:
            serverError.message = "Account not found";
            break;
          case 422:
            serverError.message = "Validation failed. Please check your input.";
            break;
          case 429:
            serverError.message =
              "Too many login attempts. Please try again in 15 minutes.";
            break;
          case 500:
            serverError.message = "Server error. Please try again later.";
            break;
          default:
            serverError.message = "Login failed. Please try again.";
        }

        throw new Error(serverError.message);
      } else if (error.request) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      } else {
        throw new Error(
          error.message || "An unexpected error occurred during login."
        );
      }
    }
  }
  async logout(): Promise<void> {
    tokenManager.clearTokens(); 
  }
  async getCurrentUser(): Promise<User> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("No valid authentication token found");
      }
      const response = await api.get("/auth/me");
      if (!response.data) {
        throw new Error("No user data returned from server");
      }
      return response.data as User;
    } catch (error: any) {
      if (error.response?.status === 401) {
        await this.logout();
        throw new Error("Session expired. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("Access denied. Insufficient permissions.");
      }
      throw new Error(error.message || "Failed to fetch user information.");
    }
  }

  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  async refreshTokens(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } =
        response.data.tokens;

      if (!accessToken || !newRefreshToken) {
        throw new Error("Invalid token response from server");
      }

      await tokenManager.setTokens(accessToken, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      await this.logout();
      throw new Error("Token refresh failed. Please log in again.");
    }
  }

  // Check if token is about to expire (for proactive refresh)
  isTokenExpiringSoon(minutes: number = 5): boolean {
    const token = tokenManager.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const timeUntilExpiry = payload.exp * 1000 - Date.now();
      return timeUntilExpiry < minutes * 60 * 1000;
    } catch {
      return true;
    }
  }
}

export const authAPI = new AuthService();
