'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Team {
  id: string;
  teamName: string;
  email: string;
  points: number;
  completedChallenges: string[];
  isActive: boolean;
  createdAt: string;
}

interface NewTeam {
  teamName: string;
  email: string;
  password: string;
}

// Add new interface for team details
interface TeamSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'compile_error' | 'runtime_error';
  points: number;
  submittedAt: string;
}

interface TeamDetails extends Team {
  submissions: TeamSubmission[];
  rank: number;
  lastActivity: string;
}

// Mock data for testing
const mockTeams: Team[] = [
  {
    id: '1',
    teamName: 'Code Warriors',
    email: 'codewarriors@example.com',
    points: 2850,
    completedChallenges: ['challenge1', 'challenge2', 'challenge3', 'challenge4'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    teamName: 'Digital Nomads',
    email: 'digitalnomads@example.com',
    points: 2100,
    completedChallenges: ['challenge1', 'challenge2', 'challenge3'],
    isActive: true,
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    teamName: 'Pixel Pirates',
    email: 'pixelpirates@example.com',
    points: 1750,
    completedChallenges: ['challenge1', 'challenge2'],
    isActive: false,
    createdAt: '2024-01-17T09:45:00Z'
  },
  {
    id: '4',
    teamName: 'Byte Busters',
    email: 'bytebusters@example.com',
    points: 3200,
    completedChallenges: ['challenge1', 'challenge2', 'challenge3', 'challenge4', 'challenge5'],
    isActive: true,
    createdAt: '2024-01-14T16:15:00Z'
  },
  {
    id: '5',
    teamName: 'Logic Lords',
    email: 'logiclords@example.com',
    points: 1450,
    completedChallenges: ['challenge1'],
    isActive: true,
    createdAt: '2024-01-18T11:30:00Z'
  },
  {
    id: '6',
    teamName: 'Algorithm Aces',
    email: 'algorithmaces@example.com',
    points: 2650,
    completedChallenges: ['challenge1', 'challenge2', 'challenge3', 'challenge4'],
    isActive: false,
    createdAt: '2024-01-19T13:45:00Z'
  },
  {
    id: '7',
    teamName: 'Function Fanatics',
    email: 'functionfanatics@example.com',
    points: 980,
    completedChallenges: [],
    isActive: true,
    createdAt: '2024-01-20T08:20:00Z'
  },
  {
    id: '8',
    teamName: 'Debug Dynasty',
    email: 'debugdynasty@example.com',
    points: 3750,
    completedChallenges: ['challenge1', 'challenge2', 'challenge3', 'challenge4', 'challenge5', 'challenge6'],
    isActive: true,
    createdAt: '2024-01-12T12:00:00Z'
  }
];

const mockTeamDetails: { [key: string]: TeamDetails } = {
  '1': {
    ...mockTeams[0],
    rank: 3,
    lastActivity: '2024-01-22T15:30:00Z',
    submissions: [
      {
        id: 'sub1',
        challengeId: 'challenge4',
        challengeTitle: 'Binary Tree Traversal',
        status: 'accepted',
        points: 500,
        submittedAt: '2024-01-22T15:30:00Z'
      },
      {
        id: 'sub2',
        challengeId: 'challenge3',
        challengeTitle: 'Dynamic Programming',
        status: 'accepted',
        points: 750,
        submittedAt: '2024-01-21T14:20:00Z'
      },
      {
        id: 'sub3',
        challengeId: 'challenge2',
        challengeTitle: 'Graph Algorithms',
        status: 'wrong_answer',
        points: 0,
        submittedAt: '2024-01-20T16:45:00Z'
      }
    ]
  },
  '2': {
    ...mockTeams[1],
    rank: 5,
    lastActivity: '2024-01-21T10:15:00Z',
    submissions: [
      {
        id: 'sub4',
        challengeId: 'challenge3',
        challengeTitle: 'Dynamic Programming',
        status: 'accepted',
        points: 750,
        submittedAt: '2024-01-21T10:15:00Z'
      },
      {
        id: 'sub5',
        challengeId: 'challenge2',
        challengeTitle: 'Graph Algorithms',
        status: 'time_limit_exceeded',
        points: 0,
        submittedAt: '2024-01-20T09:30:00Z'
      }
    ]
  }
};

export const TeamManager: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState<NewTeam>({
    teamName: '',
    email: '',
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [useMockData, setUseMockData] = useState(true); // Toggle for mock data

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Using mock data for teams');
        setTeams(mockTeams);
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('No admin token found');
        setError('Authentication required. Please login again.');
        return;
      }

      console.log('Fetching teams from /api/admin/teams...');
      const response = await fetch('/api/admin/teams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Teams fetched successfully:', data);
        setTeams(data.data || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch teams:', errorData);
        setError(`Failed to fetch teams: ${errorData.message || 'Unknown error'}`);
        setRetryCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(`Error fetching teams: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const createTeam = async () => {
    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newMockTeam: Team = {
          id: (mockTeams.length + 1).toString(),
          teamName: newTeam.teamName,
          email: newTeam.email,
          points: 0,
          completedChallenges: [],
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        setTeams(prev => [...prev, newMockTeam]);
        setIsCreateModalOpen(false);
        setNewTeam({ teamName: '', email: '', password: '' });
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTeam)
      });

      if (response.ok) {
        const data = await response.json();
        setTeams(prev => [...prev, data.data]);
        setIsCreateModalOpen(false);
        setNewTeam({ teamName: '', email: '', password: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team');
    }
  };

  const updateTeam = async () => {
    if (!selectedTeam) return;

    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTeams(prev => prev.map(team => 
          team.id === selectedTeam.id ? selectedTeam : team
        ));
        setIsEditModalOpen(false);
        setSelectedTeam(null);
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/teams/${selectedTeam.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teamName: selectedTeam.teamName,
          email: selectedTeam.email,
          isActive: selectedTeam.isActive
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTeams(prev => prev.map(team => 
          team.id === selectedTeam.id ? data.data : team
        ));
        setIsEditModalOpen(false);
        setSelectedTeam(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Error updating team');
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setTeams(prev => prev.filter(team => team.id !== teamId));
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTeams(prev => prev.filter(team => team.id !== teamId));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team');
    }
  };

  const toggleTeamStatus = async (team: Team) => {
    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const updatedTeam = { ...team, isActive: !team.isActive };
        setTeams(prev => prev.map(t => 
          t.id === team.id ? updatedTeam : t
        ));
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/teams/${team.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...team,
          isActive: !team.isActive
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTeams(prev => prev.map(t => 
          t.id === team.id ? data.data : t
        ));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update team status');
      }
    } catch (error) {
      console.error('Error updating team status:', error);
      alert('Error updating team status');
    }
  };

  const viewTeamDetails = async (team: Team) => {
    try {
      setLoadingDetails(true);
      setIsDetailModalOpen(true);
      
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get mock details or create default ones
        const details = mockTeamDetails[team.id] || {
          ...team,
          rank: Math.floor(Math.random() * 20) + 1,
          lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          submissions: [
            {
              id: `sub_${team.id}_1`,
              challengeId: 'challenge1',
              challengeTitle: 'Array Manipulation',
              status: 'accepted',
              points: 300,
              submittedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: `sub_${team.id}_2`,
              challengeId: 'challenge2',
              challengeTitle: 'String Processing',
              status: 'wrong_answer',
              points: 0,
              submittedAt: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString()
            }
          ]
        };
        
        setTeamDetails(details);
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/teams/${team.id}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeamDetails(data.data);
      } else {
        console.error('Failed to fetch team details');
        setError('Failed to fetch team details');
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
      setError('Error fetching team details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const selectAllTeams = () => {
    const allTeamIds = filteredAndSortedTeams.map(team => team.id);
    setSelectedTeams(
      selectedTeams.length === allTeamIds.length ? [] : allTeamIds
    );
  };

  const bulkActivateTeams = async () => {
    if (!confirm(`Are you sure you want to activate ${selectedTeams.length} teams?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const promises = selectedTeams.map(teamId =>
        fetch(`/api/admin/teams/${teamId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isActive: true })
        })
      );

      await Promise.all(promises);
      fetchTeams(); // Refresh the list
      setSelectedTeams([]);
    } catch (error) {
      console.error('Error in bulk activate:', error);
      alert('Error activating teams');
    }
  };

  const bulkDeactivateTeams = async () => {
    if (!confirm(`Are you sure you want to deactivate ${selectedTeams.length} teams?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const promises = selectedTeams.map(teamId =>
        fetch(`/api/admin/teams/${teamId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isActive: false })
        })
      );

      await Promise.all(promises);
      fetchTeams(); // Refresh the list
      setSelectedTeams([]);
    } catch (error) {
      console.error('Error in bulk deactivate:', error);
      alert('Error deactivating teams');
    }
  };

  const bulkDeleteTeams = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedTeams.length} teams? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const promises = selectedTeams.map(teamId =>
        fetch(`/api/admin/teams/${teamId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      await Promise.all(promises);
      fetchTeams(); // Refresh the list
      setSelectedTeams([]);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Error deleting teams');
    }
  };

  const filteredAndSortedTeams = teams
    .filter(team => 
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.teamName.toLowerCase();
          bValue = b.teamName.toLowerCase();
          break;
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mock Data Toggle */}
      <div className="flex items-center justify-between p-4 bg-oasis-dark rounded-lg border border-gray-600">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">Data Source:</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-300">Use Mock Data</span>
          </label>
          {useMockData && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-oasis-primary text-white text-xs rounded">
                DEMO MODE
              </span>
              <span className="text-gray-400 text-sm">
                ({teams.length} teams loaded)
              </span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm">
              {error} {retryCount > 0 && `(Attempt ${retryCount})`}
            </span>
            <Button
              onClick={() => {
                setError(null);
                fetchTeams();
              }}
              variant="secondary"
              size="sm"
            >
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Header Actions with Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {selectedTeams.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {selectedTeams.length} selected
              </span>
              <Button
                onClick={() => setShowBulkActions(!showBulkActions)}
                variant="secondary"
                size="sm"
              >
                Bulk Actions
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'name' | 'points' | 'createdAt');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="bg-oasis-surface border border-gray-600 rounded-md px-3 py-2 text-white"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="points-desc">Highest Points</option>
            <option value="points-asc">Lowest Points</option>
          </select>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
          >
            Create Team
          </Button>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedTeams.length > 0 && (
        <Card className="p-4 border-oasis-primary">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white font-medium">
              Bulk Actions ({selectedTeams.length} teams):
            </span>
            <Button
              onClick={bulkActivateTeams}
              variant="primary"
              size="sm"
            >
              Activate All
            </Button>
            <Button
              onClick={bulkDeactivateTeams}
              variant="secondary"
              size="sm"
            >
              Deactivate All
            </Button>
            <Button
              onClick={bulkDeleteTeams}
              variant="danger"
              size="sm"
            >
              Delete All
            </Button>
            <Button
              onClick={() => {
                setSelectedTeams([]);
                setShowBulkActions(false);
              }}
              variant="ghost"
              size="sm"
            >
              Clear Selection
            </Button>
          </div>
        </Card>
      )}

      {/* Teams Grid with Selection */}
      <div className="space-y-4">
        {/* Select All Option */}
        {filteredAndSortedTeams.length > 0 && (
          <div className="flex items-center gap-3 p-2">
            <input
              type="checkbox"
              checked={selectedTeams.length === filteredAndSortedTeams.length}
              onChange={selectAllTeams}
              className="w-4 h-4"
            />
            <span className="text-gray-400 text-sm">
              Select all teams ({filteredAndSortedTeams.length})
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTeams.map(team => (
            <Card key={team.id} className={`p-6 ${selectedTeams.includes(team.id) ? 'ring-2 ring-oasis-primary' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.id)}
                  onChange={() => handleTeamSelection(team.id)}
                  className="w-4 h-4 mt-1"
                />
                <div className="flex-1 ml-3">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {team.teamName}
                  </h3>
                  <p className="text-gray-400 text-sm">{team.email}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  team.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {team.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Points:</span>
                  <span className="text-oasis-primary font-semibold">
                    {team.points}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Challenges:</span>
                  <span className="text-white">
                    {team.completedChallenges.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined:</span>
                  <span className="text-white text-sm">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => viewTeamDetails(team)}
                  variant="outline"
                  size="sm"
                >
                  View
                </Button>
                <Button
                  onClick={() => {
                    setSelectedTeam(team);
                    setIsEditModalOpen(true);
                  }}
                  variant="secondary"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => toggleTeamStatus(team)}
                  variant={team.isActive ? "danger" : "primary"}
                  size="sm"
                >
                  {team.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  onClick={() => deleteTeam(team.id)}
                  variant="danger"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {filteredAndSortedTeams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {teams.length === 0 ? 'No teams found' : 'No teams match your search'}
          </p>
        </div>
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Team"
      >
        <div className="space-y-4">
          <Input
            label="Team Name"
            type="text"
            value={newTeam.teamName}
            onChange={(e) => setNewTeam(prev => ({ ...prev, teamName: e.target.value }))}
            placeholder="Enter team name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={newTeam.email}
            onChange={(e) => setNewTeam(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter team email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={newTeam.password}
            onChange={(e) => setNewTeam(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter team password"
            required
          />
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsCreateModalOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={createTeam}
              variant="primary"
              className="flex-1"
              disabled={!newTeam.teamName || !newTeam.email || !newTeam.password}
            >
              Create Team
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Team Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Team"
      >
        {selectedTeam && (
          <div className="space-y-4">
            <Input
              label="Team Name"
              type="text"
              value={selectedTeam.teamName}
              onChange={(e) => setSelectedTeam(prev => 
                prev ? { ...prev, teamName: e.target.value } : null
              )}
              placeholder="Enter team name"
              required
            />
            <Input
              label="Email"
              type="email"
              value={selectedTeam.email}
              onChange={(e) => setSelectedTeam(prev => 
                prev ? { ...prev, email: e.target.value } : null
              )}
              placeholder="Enter team email"
              required
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={selectedTeam.isActive}
                onChange={(e) => setSelectedTeam(prev => 
                  prev ? { ...prev, isActive: e.target.checked } : null
                )}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-white">
                Team is active
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={updateTeam}
                variant="primary"
                className="flex-1"
                disabled={!selectedTeam.teamName || !selectedTeam.email}
              >
                Update Team
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Team Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={teamDetails ? `Team Details - ${teamDetails.teamName}` : 'Team Details'}
        size="xl"
      >
        {loadingDetails ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : teamDetails ? (
          <div className="space-y-6">
            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-oasis-dark p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Total Points</h4>
                <p className="text-2xl font-bold text-oasis-primary">{teamDetails.points}</p>
              </div>
              <div className="bg-oasis-dark p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Rank</h4>
                <p className="text-2xl font-bold text-white">#{teamDetails.rank}</p>
              </div>
              <div className="bg-oasis-dark p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Challenges Completed</h4>
                <p className="text-2xl font-bold text-green-400">{teamDetails.completedChallenges.length}</p>
              </div>
            </div>

            {/* Team Info */}
            <div className="bg-oasis-dark p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Team Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{teamDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={teamDetails.isActive ? 'text-green-400' : 'text-red-400'}>
                    {teamDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined:</span>
                  <span className="text-white">{new Date(teamDetails.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Activity:</span>
                  <span className="text-white">{new Date(teamDetails.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-oasis-dark p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Recent Submissions</h4>
              {teamDetails.submissions.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {teamDetails.submissions.slice(0, 10).map(submission => (
                    <div key={submission.id} className="flex justify-between items-center p-2 bg-oasis-surface rounded">
                      <div>
                        <p className="text-white text-sm font-medium">{submission.challengeTitle}</p>
                        <p className="text-gray-400 text-xs">{new Date(submission.submittedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          submission.status === 'accepted' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {submission.status.replace('_', ' ')}
                        </span>
                        <span className="text-oasis-primary font-medium">+{submission.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No submissions yet</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setIsDetailModalOpen(false)}
                variant="primary"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Failed to load team details</p>
        )}
      </Modal>
    </div>
  );
};
