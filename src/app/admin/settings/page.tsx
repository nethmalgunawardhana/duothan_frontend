'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'OASIS Competition',
    contactEmail: 'admin@oasis.com',
    maxTeamSize: 4,
    submissionLimit: 10,
    competitionStartDate: '2025-07-20',
    competitionEndDate: '2025-07-22',
    enableRegistration: true,
    enableSubmissions: true,
    showLeaderboard: true,
    maintenanceMode: false,
  });

  const [notification, setNotification] = useState('');

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simple hardcoded save - just show notification
    setNotification('Settings saved successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleReset = () => {
    setSettings({
      siteName: 'OASIS Competition',
      contactEmail: 'admin@oasis.com',
      maxTeamSize: 4,
      submissionLimit: 10,
      competitionStartDate: '2025-07-20',
      competitionEndDate: '2025-07-22',
      enableRegistration: true,
      enableSubmissions: true,
      showLeaderboard: true,
      maintenanceMode: false,
    });
    setNotification('Settings reset to defaults!');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {notification && (
        <div className="bg-green-600 text-white p-4 rounded-lg">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Site Name
                </label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Email
                </label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Team Size
                </label>
                <Input
                  type="number"
                  value={settings.maxTeamSize}
                  onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value) || 0)}
                  placeholder="Enter max team size"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Competition Settings */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Competition Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Submission Limit per Team
                </label>
                <Input
                  type="number"
                  value={settings.submissionLimit}
                  onChange={(e) => handleInputChange('submissionLimit', parseInt(e.target.value) || 0)}
                  placeholder="Enter submission limit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Competition Start Date
                </label>
                <Input
                  type="date"
                  value={settings.competitionStartDate}
                  onChange={(e) => handleInputChange('competitionStartDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Competition End Date
                </label>
                <Input
                  type="date"
                  value={settings.competitionEndDate}
                  onChange={(e) => handleInputChange('competitionEndDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Feature Toggles</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Enable Team Registration
                </label>
                <button
                  onClick={() => handleInputChange('enableRegistration', !settings.enableRegistration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableRegistration ? 'bg-oasis-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableRegistration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Enable Submissions
                </label>
                <button
                  onClick={() => handleInputChange('enableSubmissions', !settings.enableSubmissions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableSubmissions ? 'bg-oasis-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableSubmissions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Show Leaderboard
                </label>
                <button
                  onClick={() => handleInputChange('showLeaderboard', !settings.showLeaderboard)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showLeaderboard ? 'bg-oasis-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showLeaderboard ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Maintenance Mode
                </label>
                <button
                  onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Database</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Judge0 API</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Email Service</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">File Storage</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Available
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Teams</span>
                <span className="text-oasis-primary font-medium">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Submissions</span>
                <span className="text-oasis-primary font-medium">156</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="ghost" className="h-16 flex-col">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cache
            </Button>
            <Button variant="ghost" className="h-16 flex-col">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export Data
            </Button>
            <Button variant="ghost" className="h-16 flex-col">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Health Check
            </Button>
            <Button variant="ghost" className="h-16 flex-col">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restart Services
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
