'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/validation';

export const TeamLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { loginTeam, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) setEmailError('');
    if (error) clearError();
  };

  const handleGitHubLogin = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    // Mock GitHub OAuth flow
    const mockGitHubData = {
      id: 'github_' + Date.now(),
      login: email.split('@')[0],
      email: email,
      name: email.split('@')[0],
      avatar_url: `https://github.com/${email.split('@')[0]}.png`,
    };

    const success = await loginTeam(email, 'github', mockGitHubData);
    if (success) {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    // Mock Google OAuth flow
    const mockGoogleData = {
      id: 'google_' + Date.now(),
      email: email,
      name: email.split('@')[0],
      picture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=00D4FF&color=fff`,
    };

    const success = await loginTeam(email, 'google', mockGoogleData);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" glowing>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-oasis-primary mb-2">Access the OASIS</h2>
        <p className="text-gray-400">Login with your team credentials</p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          label="Team Email"
          placeholder="team@oasis.com"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          icon={<span>📧</span>}
        />

        {error && (
          <div className="p-3 bg-oasis-error/10 border border-oasis-error rounded-lg">
            <p className="text-oasis-error text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleGitHubLogin}
            loading={loading}
            disabled={!email.trim()}
          >
            <span>🐙</span>
            Continue with GitHub
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGoogleLogin}
            loading={loading}
            disabled={!email.trim()}
          >
            <span>🌐</span>
            Continue with Google
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Don't have a team?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-oasis-primary hover:text-oasis-accent transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
};