import { supabase } from '../supabase/client';

class ApiClient {
  private baseUrl: string;

  constructor() {
    // In Expo, API routes are available at the same domain
    this.baseUrl = '/api';
  }

  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  private getPublicHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Public methods (no authentication required)
  async publicGet<T>(endpoint: string): Promise<T> {
    const headers = this.getPublicHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async publicPost<T>(endpoint: string, data?: any): Promise<T> {
    const headers = this.getPublicHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Authenticated methods (require authentication)
  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(); 