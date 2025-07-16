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

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  type: 'algorithmic' | 'buildathon';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number;
  flags?: string[];
  testCases?: TestCase[];
  resources?: Resource[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Resource {
  name: string;
  url: string;
  type: 'document' | 'video' | 'code' | 'other';
}

export interface SubmissionData {
  id: string;
  challengeId: string;
  teamId: string;
  solution: string;
  language: string;
  status: 'pending' | 'correct' | 'incorrect' | 'processing';
  points: number;
  feedback?: string;
  executionTime?: number;
  executionMemory?: number;
  executionResult?: {
    stdout?: string;
    stderr?: string;
    compile_output?: string;
    status: {
      id: number;
      description: string;
    };
  };
  submittedAt: string;
}

export interface DashboardStats {
  totalTeams: number;
  totalChallenges: number;
  totalSubmissions: number;
  completedSubmissions: number;
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

  // Dashboard Stats
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

  async createChallenge(challenge: Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ChallengeData>> {
    return this.request('/admin/challenges', {
      method: 'POST',
      body: JSON.stringify(challenge),
    });
  }

  async updateChallenge(id: string, challenge: Partial<Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<ChallengeData>> {
    return this.request(`/admin/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challenge),
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
    status?: 'pending' | 'correct' | 'incorrect' | 'processing';
  }): Promise<ApiResponse<SubmissionData[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/submissions?${queryString}` : '/admin/submissions';
    
    return this.request(endpoint);
  }

  async getSubmissionById(id: string): Promise<ApiResponse<SubmissionData>> {
    return this.request(`/admin/submissions/${id}`);
  }

  async updateSubmission(id: string, data: Partial<Omit<SubmissionData, 'id' | 'submittedAt'>>): Promise<ApiResponse<SubmissionData>> {
    return this.request(`/admin/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Team Submissions
  async getTeamSubmissions(): Promise<ApiResponse<SubmissionData[]>> {
    return this.request('/team/submissions');
  }

  async getTeamSubmissionById(id: string): Promise<ApiResponse<SubmissionData>> {
    return this.request(`/team/submissions/${id}`);
  }

  async submitSolution(data: {
    challengeId: string;
    solution: string;
    language: string;
  }): Promise<ApiResponse<SubmissionData>> {
    return this.request('/team/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTeamSubmissionHistory(challengeId?: string): Promise<ApiResponse<SubmissionData[]>> {
    const endpoint = challengeId 
      ? `/team/submissions/history?challengeId=${challengeId}`
      : '/team/submissions/history';
    
    return this.request(endpoint);
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