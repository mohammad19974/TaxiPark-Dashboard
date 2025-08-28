import { OpenAPI } from './generated';
import { useAuthStore } from '../store/authStore';

// Configure the OpenAPI client
export const configureApiClient = () => {
  // Set base URL from environment or default
  OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  
  // Set credentials to include cookies
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = 'include';
  
  // Set up token resolver
  OpenAPI.TOKEN = async () => {
    const token = localStorage.getItem('auth_token');
    return token || '';
  };
  
  // Set up headers
  OpenAPI.HEADERS = {
    'Content-Type': 'application/json',
  };
};

// Initialize API configuration
configureApiClient();

// Re-configure when auth state changes
if (typeof window !== 'undefined') {
  // Listen for storage changes to update token
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth_token') {
      configureApiClient();
    }
  });
}