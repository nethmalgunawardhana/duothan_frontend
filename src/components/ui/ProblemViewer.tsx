import React from 'react';
import { ChallengeData } from '@/utils/api';

interface ProblemViewerProps {
  challenge: ChallengeData;
}

export const ProblemViewer: React.FC<ProblemViewerProps> = ({ challenge }) => {
  const renderDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="bg-green-900/30 text-green-500 px-2 py-1 rounded text-xs font-medium">Easy</span>;
      case 'medium':
        return <span className="bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs font-medium">Medium</span>;
      case 'hard':
        return <span className="bg-red-900/30 text-red-500 px-2 py-1 rounded text-xs font-medium">Hard</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{challenge.title}</h1>
          <div className="flex items-center mt-2 space-x-3">
            {renderDifficulty(challenge.difficulty)}
            <span className="bg-oasis-primary/20 text-oasis-primary px-2 py-1 rounded text-xs font-medium">
              {challenge.points} Points
            </span>
            <span className="bg-oasis-secondary/20 text-oasis-secondary px-2 py-1 rounded text-xs font-medium capitalize">
              {challenge.type}
            </span>
            {challenge.timeLimit && (
              <span className="bg-purple-900/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">
                {challenge.timeLimit} min
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap">{challenge.description}</div>
        
        {challenge.testCases && challenge.testCases.some(tc => !tc.isHidden) && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Example Test Cases</h3>
            <div className="space-y-4">
              {challenge.testCases
                .filter(tc => !tc.isHidden)
                .map((testCase, index) => (
                  <div key={index} className="bg-oasis-dark p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="text-gray-400">Input:</span>
                      <pre className="bg-black/30 p-2 rounded mt-1 text-white overflow-x-auto">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-gray-400">Expected Output:</span>
                      <pre className="bg-black/30 p-2 rounded mt-1 text-white overflow-x-auto">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {challenge.resources && challenge.resources.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {challenge.resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-oasis-primary hover:underline flex items-center"
                  >
                    {resource.name}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      ></path>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 