// Test component to verify backend connection
'use client';

import { useState } from 'react';
import { apiClient } from '@/utils/api';

export default function ConnectionTest() {
  const [status, setStatus] = useState<string>('Not tested');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing...');
    
    try {
      const response = await apiClient.healthCheck();
      if (response.success) {
        setStatus('✅ Backend connection successful!');
      } else {
        setStatus(`❌ Backend error: ${response.error}`);
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        <div className="p-3 bg-gray-100 rounded">
          <p className="text-sm">Status: {status}</p>
          <p className="text-xs text-gray-600 mt-2">
            Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
          </p>
        </div>
      </div>
    </div>
  );
}
