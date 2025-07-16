'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';


export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-oasis-dark flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-oasis-primary mb-4 font-cyber">
          🚀 OASIS Protocol
        </h1>
        <p className="text-xl text-gray-400 mb-2">
          Ready Player One Buildathon Platform
        </p>
        <p className="text-lg text-oasis-accent">
          Enter the OASIS. Complete the challenges. Become legendary.
        </p>
      </div>

      <Card className="w-full max-w-md" glowing>
        <div className="space-y-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            🎮 Team Login
          </Button>
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push('/register')}
          >
            ⚡ Register New Team
          </Button>

          <div className="pt-4 border-t border-oasis-primary/30">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/admin/login')}
            >
              🔒 Admin Access
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Powered by OASIS Protocol • Ready Player One Inspired
        </p>
      </div>

   
    </div>
  );
}
