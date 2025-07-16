'use client';

import { useState, useEffect } from 'react';
import { healthAPI } from '@/lib/api';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  services: {
    firebase: boolean;
    sendgrid: boolean;
    imagekit: boolean;
  };
}

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthAPI.check();
        setHealth(response.data.data);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Checking services...</div>;
  }

  if (!health) {
    return <div className="text-red-500">Unable to check service status</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">System Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            health.status === 'OK' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {health.status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Firebase</span>
          <span className={`w-3 h-3 rounded-full ${
            health.services.firebase ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Email Service</span>
          <span className={`w-3 h-3 rounded-full ${
            health.services.sendgrid ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Image Service</span>
          <span className={`w-3 h-3 rounded-full ${
            health.services.imagekit ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Uptime: {Math.floor(health.uptime / 60)} minutes
          </div>
        </div>
      </div>
    </div>
  );
}