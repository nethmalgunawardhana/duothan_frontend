const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProviderData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

export interface TeamData {
  id: string;
  teamName: string;
  email: string;
  authProvider: 'github' | 'google';
  providerData: ProviderData;
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

  private getToken(isAdmin: boolean = false): string | null {
    if (typeof window === 'undefined') return null;
    const tokenKey = isAdmin ? 'oasis_admin_token' : 'oasis_token';
    return localStorage.getItem(tokenKey);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isAdminRequest: boolean = false
  ): Promise<ApiResponse<T>> {
    // Safely get token from localStorage (handle SSR)
    const token = this.getToken(isAdminRequest);
    
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
    providerData: ProviderData;
  }): Promise<ApiResponse<{ team: TeamData; token: string }>> {
    return this.request('/auth/team/register', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async loginTeam(credentials: {
    email: string;
    authProvider: 'github' | 'google';
    providerData: ProviderData;
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
    }, true);
  }

  async logoutAdmin(): Promise<ApiResponse> {
    return this.request('/admin/logout', {
      method: 'POST',
    }, true);
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Team Profile
  async getTeamProfile(): Promise<ApiResponse<TeamData>> {
    return this.request('/auth/team/profile');
  }

  async updateTeamProfile(data: Partial<TeamData>): Promise<ApiResponse<TeamData>> {
    return this.request('/auth/team/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Submissions
  async submitSolution(submissionData: {
    challengeId: string;
    code: string;
    language: string;
  }): Promise<ApiResponse> {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  }

  async getSubmissions(): Promise<ApiResponse> {
    return this.request('/submissions');
  }

  async getSubmissionById(id: string): Promise<ApiResponse> {
    return this.request(`/submissions/${id}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);