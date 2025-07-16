'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileCard() {
  const { team, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [teamName, setTeamName] = useState(team?.teamName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement team profile update
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Profile update failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!team) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-indigo-600 hover:text-indigo-500"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <p className="mt-1 text-sm text-gray-900">{team.teamName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{team.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Auth Provider</label>
            <p className="mt-1 text-sm text-gray-900 capitalize">{team.authProvider}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Points</label>
            <p className="mt-1 text-sm font-bold text-green-600">{team.points}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1 text-sm text-gray-900">
              {team.isActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-600">Inactive</span>
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}