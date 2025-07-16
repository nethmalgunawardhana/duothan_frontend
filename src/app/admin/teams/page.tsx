'use client';

'use client';

import React from 'react';
import { TeamManager } from '../../../components/admin/TeamManager';

export default function TeamsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
        <p className="text-gray-400">
          Manage teams, view team details, and monitor team performance
        </p>
      </div>
      
      <TeamManager />
    </div>
  );
}
