'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { validateTeamName, validateEmail } from '@/utils/validation';

export const TeamRegisterForm: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [teamNameError, setTeamNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { registerTeam, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeamName(value);
    if (teamNameError) setTeamNameError('');
    if (error) clearError();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) setEmailError('');
    if (error) clearError();
  };

  const validateForm = () => {
    let isValid = true;

    const teamNameValidation = validateTeamName(teamName);
    if (!teamNameValidation.isValid) {
      setTeamNameError(teamNameValidation.error || '');
      isValid = false;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      isValid = false;
    }

    return isValid;
  };

  const handleGitHubRegister = async () => {
    if (!validateForm()) return;

    // Mock GitHub OAuth flow
    const mockGitHubData = {
      id: 'github_' + Date.now(),
      login: email.split('@')[0],
      email: email,
      name: teamName,
      avatar_url: `https://github.com/${email.split('@')[0]}.png`,
    };

    const success = await registerTeam(teamName, email, 'github', mockGitHubData);
    if (success) {
      router.push('/challenges');
    }
  };

  const handleGoogleRegister = async () => {
    if (!validateForm()) return;

    // Mock Google OAuth flow
    const mockGoogleData = {
      id: 'google_' + Date.now(),
      email: email,
      name: teamName,
      picture: `https://ui-avatars.com/api/?name=${teamName}&background=00D4FF&color=fff`,
    };

    const success = await registerTeam(teamName, email, 'google', mockGoogleData);
    if (success) {
      router.push('/challenges');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" glowing>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-oasis-primary mb-2">Join the OASIS</h2>
        <p className="text-gray-400">Register your team to enter the competition</p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          label="Team Name"
          placeholder="Enter your unique team name"
          value={teamName}
          onChange={handleTeamNameChange}
          error={teamNameError}
          icon={<span>👥</span>}
        />

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
            onClick={handleGitHubRegister}
            loading={loading}
            disabled={!teamName.trim() || !email.trim()}
          >
            <span>🐙</span>
            Register with GitHub
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGoogleRegister}
            loading={loading}
            disabled={!teamName.trim() || !email.trim()}
          >
            <span>🌐</span>
            Register with Google
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Already have a team?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-oasis-primary hover:text-oasis-accent transition-colors"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
};