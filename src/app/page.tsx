'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user is authenticated
    // Don't redirect non-authenticated users - let them see the landing page
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated, they'll be redirected to dashboard
  // If not authenticated, show the landing page
  if (isAuthenticated) {
    return <LoadingSpinner />; // Brief loading while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Duothan</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl lg:text-7xl">
            Build Your Next
            <span className="text-indigo-600"> Amazing Project</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            A complete full-stack application with authentication, file uploads, 
            email services, and everything you need to build modern web applications.
          </p>
          
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
              <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Authentication</h3>
            <p className="text-gray-600">JWT-based authentication with password hashing and session management</p>
          </div>

          <div className="text-center group">
            <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
              <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">File Uploads</h3>
            <p className="text-gray-600">ImageKit integration for optimized image management and CDN delivery</p>
          </div>

          <div className="text-center group">
            <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
              <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Service</h3>
            <p className="text-gray-600">SendGrid integration for transactional emails and notifications</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built with Modern Technology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-gray-900">Next.js 14</h4>
                <p className="text-sm text-gray-600 mt-1">React Framework</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-gray-900">TypeScript</h4>
                <p className="text-sm text-gray-600 mt-1">Type Safety</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-gray-900">Firebase</h4>
                <p className="text-sm text-gray-600 mt-1">Database</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-gray-900">Tailwind CSS</h4>
                <p className="text-sm text-gray-600 mt-1">Styling</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-indigo-600 rounded-2xl px-8 py-16 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to start building?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are building amazing applications with our platform.
            </p>
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Duothan. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
}