import { type LoginRequest, type RegisterRequest, type AuthResponse } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8000';

interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class AuthService {
  private token: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.token = this.getStoredToken();
  }

  private getStoredToken(): string | null {
    try {
      return sessionStorage.getItem('token') || localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  private setToken(token: string, remember: boolean = false): void {
    this.token = token;
    try {
      if (remember) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
    } catch (error) {
      console.warn('Failed to store token:', error);
    }
  }

  private getAuthHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: errorData
      };
      throw error;
    }
    return response.json();
  }

  async login(credentials: LoginRequest, remember: boolean = false): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await this.handleResponse<AuthResponse>(response);
      this.setToken(data.access_token, remember);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await this.handleResponse<AuthResponse>(response);
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) {
        this.logout();
      }
      throw error instanceof Error ? error : new Error('Failed to get user');
    }
  }

  async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          credentials: 'include',
        });

        const data = await this.handleResponse<{ access_token: string }>(response);
        this.setToken(data.access_token);
        return data.access_token;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  logout(): void {
    this.token = null;
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    } catch (error) {
      console.warn('Failed to clear tokens:', error);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();
