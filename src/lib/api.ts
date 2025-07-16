import axios from 'axios';

// Import types for request and response
import { NextApiRequest, NextApiResponse } from 'next';

// Define Team interface
interface Team {
  _id: string;
  teamName: string;
  points: number;
  completedChallenges: string[];
  lastSubmissionTime: string;
  createdAt: string;
  isActive: boolean;
}

// Define LeaderboardEntry interface
interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  points: number;
  completedChallenges: number;
  lastSubmissionTime: string;
  rank?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: { name: string }) =>
    api.put('/auth/profile', data),
};

// Health API functions
export const healthAPI = {
  check: () => api.get('/health'),
  database: () => api.get('/health/database'),
  services: () => api.get('/health/services'),
};

// Leaderboard Controller

export const leaderboardController = {
  /**
   * Get the current leaderboard with team rankings
   */
  getLeaderboard: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const leaderboard = await leaderboardService.calculateRankings();
      
      return res.status(200).json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch leaderboard'
      });
    }
  }
};

// Leaderboard Service

export const leaderboardService = {
  /**
   * Calculate team rankings based on completed challenges and submission time
   */
  calculateRankings: async (): Promise<LeaderboardEntry[]> => {
    try {
      // Mock data for frontend development
      // In a real implementation, this would fetch from a database
      const teams: Team[] = [
        {
          _id: '1',
          teamName: 'Team Alpha',
          points: 15,
          completedChallenges: ['1', '2', '3'],
          lastSubmissionTime: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isActive: true
        },
        {
          _id: '2',
          teamName: 'Team Beta',
          points: 10,
          completedChallenges: ['1', '2'],
          lastSubmissionTime: new Date(Date.now() - 7200000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isActive: true
        },
        {
          _id: '3',
          teamName: 'Team Gamma',
          points: 15,
          completedChallenges: ['1', '2', '3'],
          lastSubmissionTime: new Date(Date.now() - 1800000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isActive: true
        }
      ];
      
      // Map teams to leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = teams.map((team: Team) => {
        return {
          teamId: team._id,
          teamName: team.teamName,
          points: team.points || 0,
          completedChallenges: team.completedChallenges?.length || 0,
          lastSubmissionTime: team.lastSubmissionTime || team.createdAt,
        };
      });
      
      // Sort entries by points (descending) and then by submission time (ascending)
      const sortedEntries = leaderboardEntries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
        // First sort by points (higher points first)
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        
        // If points are equal, sort by number of completed challenges
        if (b.completedChallenges !== a.completedChallenges) {
          return b.completedChallenges - a.completedChallenges;
        }
        
        // If completed challenges are equal, sort by submission time (earlier first)
        return new Date(a.lastSubmissionTime).getTime() - new Date(b.lastSubmissionTime).getTime();
      });
      
      // Add rank to each entry
      return sortedEntries.map((entry: LeaderboardEntry, index: number) => ({
        ...entry,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error calculating rankings:', error);
      throw error;
    }
  }
};

export default api;