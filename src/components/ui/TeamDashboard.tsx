import React from 'react';
import Link from 'next/link';
import { ChallengeData, TeamData } from '@/utils/api';

interface TeamDashboardProps {
  team: TeamData;
  challenges: ChallengeData[];
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({ team, challenges }) => {
  const completedChallenges = challenges.filter(challenge => 
    team.completedChallenges.includes(challenge.id)
  );
  
  const availableChallenges = challenges.filter(challenge => 
    !team.completedChallenges.includes(challenge.id)
  );

  const algorithmicChallenges = completedChallenges.filter(c => c.type === 'algorithmic');
  const buildathonChallenges = completedChallenges.filter(c => c.type === 'buildathon');
  
  const renderProgressBar = () => {
    const totalChallenges = challenges.length;
    const completed = completedChallenges.length;
    const percentage = totalChallenges > 0 ? (completed / totalChallenges) * 100 : 0;
    
    return (
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{completed} / {totalChallenges} challenges completed</span>
        </div>
        <div className="h-3 bg-oasis-dark rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-oasis-primary to-oasis-secondary" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Team Progress</h2>
          <div className="text-oasis-primary font-bold text-xl">
            {team.points} Points
          </div>
        </div>
        
        {renderProgressBar()}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-oasis-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Total Challenges</h3>
            <div className="text-3xl font-bold text-oasis-primary">
              {completedChallenges.length} / {challenges.length}
            </div>
          </div>
          
          <div className="bg-oasis-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Algorithmic</h3>
            <div className="text-3xl font-bold text-oasis-secondary">
              {algorithmicChallenges.length}
            </div>
          </div>
          
          <div className="bg-oasis-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Buildathon</h3>
            <div className="text-3xl font-bold text-oasis-accent">
              {buildathonChallenges.length}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
          <h2 className="text-xl font-bold text-white mb-4">Available Challenges</h2>
          
          {availableChallenges.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              You've completed all available challenges!
            </div>
          ) : (
            <div className="space-y-4">
              {availableChallenges.slice(0, 5).map(challenge => (
                <Link 
                  key={challenge.id} 
                  href={`/dashboard/challenges/${challenge.id}`}
                  className="block bg-oasis-dark rounded-lg p-4 hover:border-oasis-primary/50 border border-transparent transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold">{challenge.title}</h3>
                      <div className="flex space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 rounded bg-oasis-primary/20 text-oasis-primary">
                          {challenge.points} Points
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-oasis-secondary/20 text-oasis-secondary capitalize">
                          {challenge.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-oasis-primary">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
              
              {availableChallenges.length > 5 && (
                <Link href="/dashboard/challenges" className="block text-center text-oasis-primary hover:underline mt-2">
                  View all {availableChallenges.length} available challenges
                </Link>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
          <h2 className="text-xl font-bold text-white mb-4">Completed Challenges</h2>
          
          {completedChallenges.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              You haven't completed any challenges yet
            </div>
          ) : (
            <div className="space-y-4">
              {completedChallenges.slice(0, 5).map(challenge => (
                <Link 
                  key={challenge.id} 
                  href={`/dashboard/challenges/${challenge.id}`}
                  className="block bg-oasis-dark rounded-lg p-4 hover:border-oasis-primary/50 border border-transparent transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold">{challenge.title}</h3>
                      <div className="flex space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-500">
                          Completed
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-oasis-secondary/20 text-oasis-secondary capitalize">
                          {challenge.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-oasis-primary">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
              
              {completedChallenges.length > 5 && (
                <Link href="/dashboard/challenges" className="block text-center text-oasis-primary hover:underline mt-2">
                  View all {completedChallenges.length} completed challenges
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 