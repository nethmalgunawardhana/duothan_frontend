import React from 'react';
import { TeamLoginForm } from '@/components/auth/TeamLoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-oasis-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-oasis-primary mb-2">
            🚀 OASIS Protocol
          </h1>
          <p className="text-gray-400">
            Ready Player One Buildathon Platform
          </p>
        </div>
        <TeamLoginForm />
      </div>
    </div>
  );
}