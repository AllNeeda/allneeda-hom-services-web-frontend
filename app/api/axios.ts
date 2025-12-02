// app/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://servicyee-backend.onrender.com/api/v1',
  timeout: 100000,


  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookie sending for cross-origin requests
});

// Enhanced Token Manager with Cookie Support
class AuthTokenManager {
  private readonly ACCESS_TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';

  // Set tokens in cookies (accessible by middleware)
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      // Set secure cookies with proper attributes
      document.cookie = `${this.ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=1800; secure; samesite=strict`; // 30 minutes
      document.cookie = `${this.REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=2592000; secure; samesite=strict`; // 30 days
    } catch (error) {
      console.error('Failed to set tokens in cookies:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  // Get access token from cookies
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.ACCESS_TOKEN_KEY) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Get refresh token from cookies
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.REFRESH_TOKEN_KEY) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Clear all tokens from cookies
  clearTokens(): void {
      document.cookie = `${this.ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // Additional token validation (check expiration)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp && Date.now() >= payload.exp * 1000;
      return !isExpired;
    } catch {
      return false;
    }
  }

  // Validate token structure and expiration
  validateToken(token: string): boolean {
    if (!token) return false;
    
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;
      
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Check expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
}

export const tokenManager = new AuthTokenManager();

// Request interceptor - automatically attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = tokenManager.getAccessToken();
      if (token && tokenManager.validateToken(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token) {
        // Token exists but is invalid, clear it
        tokenManager.clearTokens();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced Response interceptor with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 errors)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken && tokenManager.validateToken(refreshToken)) {
        originalRequest._retry = true;
        
      } else {
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login?reason=authentication_required';
        }
      }
    }

    // Handle other common errors
    if (error.response?.status === 403) {
      console.error('Access forbidden');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login?reason=access_denied';
      }
    }

    if (error.response?.status === 429)
    return Promise.reject(error);
  }
);

// Utility functions for external use
export const setAccessToken = (token: string) => {
  const refreshToken = tokenManager.getRefreshToken();
  if (refreshToken) {
    tokenManager.setTokens(token, refreshToken);
  }
};

export const clearAccessToken = () => {
  tokenManager.clearTokens();
};

export const getAccessToken = () => tokenManager.getAccessToken();

export { api };



 export const getStaticURL = () => {
  return "https://servicyee-backend.onrender.com/uploads/service";
 }

 export const getSubcategoryStaticURL = () => {
  return "https://servicyee-backend.onrender.com/uploads/SubCategory";
 }

  export const getCategoryStaticURL = () => {
  return "https://servicyee-backend.onrender.com/uploads/category";
 }

 export const getMediacUrl = () => {
  return 'http://localhost:4000';
 }
 export const getPorfessionalsStaticURL = () => {
    return "https://servicyee-backend.onrender.com/uploads/professionals";
 }