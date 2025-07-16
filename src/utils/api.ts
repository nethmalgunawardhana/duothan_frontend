const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TeamData {
  id: string;
  teamName: string;
  email: string;
  authProvider: 'github' | 'google';
  providerData: any;
  points: number;
  completedChallenges: string[];
  isActive: boolean;
  createdAt: string;
}

export interface AdminData {
  id: string;
  email: string;
  role: 'admin';
  isActive: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('oasis_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Team Authentication
  async registerTeam(teamData: {
    teamName: string;
    email: string;
    authProvider: 'github' | 'google';
    providerData: any;
  }): Promise<ApiResponse<{ team: TeamData; token: string }>> {
    return this.request('/auth/team/register', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async loginTeam(credentials: {
    email: string;
    authProvider: 'github' | 'google';
    providerData: any;
  }): Promise<ApiResponse<{ team: TeamData; token: string }>> {
    return this.request('/auth/team/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logoutTeam(): Promise<ApiResponse> {
    return this.request('/auth/team/logout', {
      method: 'POST',
    });
  }

  // Admin Authentication
  async loginAdmin(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ admin: AdminData; token: string }>> {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logoutAdmin(): Promise<ApiResponse> {
    return this.request('/admin/logout', {
      method: 'POST',
    });
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);