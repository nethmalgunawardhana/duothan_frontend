// src/utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Types
export interface AdminData {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  type: 'algorithmic' | 'buildathon';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  flags?: string[];
  testCases?: TestCase[];
  resources?: string[];
  isActive: boolean;
  timeLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface SubmissionData {
  id: string;
  teamId: string;
  challengeId: string;
  solution: string;
  language: string;
  status: 'pending' | 'correct' | 'incorrect' | 'processing';
  points: number;
  submittedAt: string;
  executionTime?: number;
  executionMemory?: number;
  executionResult?: {
    stdout?: string;
    stderr?: string;
    compile_output?: string;
  };
  feedback?: string;
}

export interface TeamData {
  id: string;
  teamName: string;
  email: string;
  points: number;
  createdAt: string;
  isActive: boolean;
  completedChallenges?: string[];
}

export interface DashboardStats {
  totalTeams: number;
  totalChallenges: number;
  totalSubmissions: number;
  completedSubmissions: number;
  recentSubmissions: SubmissionData[];
  topTeams: TeamData[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('oasis_admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
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
    return this.request('/admin/logout', { method: 'POST' });
  }

  async getAdminProfile(): Promise<ApiResponse<AdminData>> {
    return this.request('/admin/profile');
  }

  async updateAdminProfile(data: Partial<AdminData>): Promise<ApiResponse<AdminData>> {
    return this.request('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request('/admin/dashboard/stats');
  }

  // Challenge Management
  async getChallenges(): Promise<ApiResponse<ChallengeData[]>> {
    return this.request('/admin/challenges');
  }

  async getChallengeById(id: string): Promise<ApiResponse<ChallengeData>> {
    return this.request(`/admin/challenges/${id}`);
  }

  async createChallenge(
    challengeData: Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<ChallengeData>> {
    return this.request('/admin/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    });
  }

  async updateChallenge(
    id: string,
    challengeData: Partial<ChallengeData>
  ): Promise<ApiResponse<ChallengeData>> {
    return this.request(`/admin/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challengeData),
    });
  }

  async deleteChallenge(id: string): Promise<ApiResponse> {
    return this.request(`/admin/challenges/${id}`, {
      method: 'DELETE',
    });
  }

  // Submission Management
  async getSubmissions(filters?: {
    challengeId?: string;
    teamId?: string;
    status?: string;
    limit?: number;
  }): Promise<ApiResponse<SubmissionData[]>> {
    const params = new URLSearchParams();
    if (filters?.challengeId) params.append('challengeId', filters.challengeId);
    if (filters?.teamId) params.append('teamId', filters.teamId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/admin/submissions${query}`);
  }

  async getSubmissionById(id: string): Promise<ApiResponse<SubmissionData>> {
    return this.request(`/admin/submissions/${id}`);
  }

  async updateSubmission(
    id: string,
    data: Partial<SubmissionData>
  ): Promise<ApiResponse<SubmissionData>> {
    return this.request(`/admin/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getSubmissionsByTeam(teamId: string): Promise<ApiResponse<SubmissionData[]>> {
    return this.request(`/admin/teams/${teamId}/submissions`);
  }

  // Team Management
  async getTeams(): Promise<ApiResponse<TeamData[]>> {
    return this.request('/admin/teams');
  }

  async getTeamById(id: string): Promise<ApiResponse<TeamData>> {
    return this.request(`/admin/teams/${id}`);
  }

  // Code Execution
  async executeCode(data: {
    code: string;
    language: string;
    stdin?: string;
  }): Promise<ApiResponse<{
    executionResult: {
      stdout?: string;
      stderr?: string;
      compile_output?: string;
      status?: string;
    };
    executionTime: number;
  }>> {
    return this.request('/admin/execute', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('oasis_admin_token');
    return !!token;
  }

  // Helper method to get stored admin data
  getStoredAdmin(): AdminData | null {
    const adminData = localStorage.getItem('oasis_admin');
    return adminData ? JSON.parse(adminData) : null;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);