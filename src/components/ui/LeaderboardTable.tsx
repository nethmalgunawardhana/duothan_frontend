import React from 'react';
import { LeaderboardEntry } from '@/utils/api';
import { LoadingSpinner } from './LoadingSpinner';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  currentTeamId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  loading,
  error,
  currentTeamId
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-500">
        {error}
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No teams on the leaderboard yet
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-oasis-dark">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Challenges</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Submission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaderboard.map((entry) => {
              const isCurrentTeam = entry.teamId === currentTeamId;
              
              return (
                <tr 
                  key={entry.teamId}
                  className={`${isCurrentTeam ? 'bg-oasis-primary/20' : 'hover:bg-oasis-dark/50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.rank === 1 && (
                        <span className="text-yellow-500 mr-2">🏆</span>
                      )}
                      {entry.rank === 2 && (
                        <span className="text-gray-400 mr-2">🥈</span>
                      )}
                      {entry.rank === 3 && (
                        <span className="text-amber-700 mr-2">🥉</span>
                      )}
                      <span className={`${isCurrentTeam ? 'text-oasis-primary font-bold' : 'text-white'}`}>
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${isCurrentTeam ? 'text-oasis-primary font-bold' : 'text-white'}`}>
                      {entry.teamName}
                      {isCurrentTeam && <span className="ml-2 text-xs">(You)</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-oasis-primary font-bold">
                      {entry.points}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {entry.completedChallenges}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                    {formatDate(entry.lastSubmissionTime)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 