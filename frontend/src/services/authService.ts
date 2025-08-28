import { apiClient } from './api';
import * as Types from '../types';
type User = Types.User;
type LoginForm = Types.LoginForm;
type ApiResponse<T> = Types.ApiResponse<T>;

interface LoginResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginForm): Promise<LoginResponse> {
    try {
      console.log('AuthService: Attempting login with credentials:', { email: credentials.email });
      
      const response = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      
      console.log('AuthService: Login API response:', response);
      
      // Backend returns access_token, but we need token for consistency
      const backendResponse = response as any;
      const loginResponse: LoginResponse = {
        user: backendResponse.user,
        token: backendResponse.access_token,
      };
      
      console.log('AuthService: Mapped login response:', loginResponse);
      this.setToken(loginResponse.token);
      return loginResponse;
    } catch (error) {
      console.error('AuthService: Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.token;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();