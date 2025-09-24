'use client';

import { useSearchParams } from 'next/navigation';
import { HiMail, HiRefresh } from 'react-icons/hi';
import { useState, Suspense } from 'react';
import Navigation from '@/components/mobile-games/MobileGamesNavigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendMessage('');

    try {
      // Call the resend verification endpoint
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendMessage('Verification email sent! Please check your inbox.');
      } else {
        const data = await response.json();
        setResendMessage(data.error || 'Failed to resend email');
      }
    } catch (error) {
      setResendMessage('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center px-4 pt-24 pb-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiMail className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-title">
          Check your email
        </h1>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification link to:
          <br />
          <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Click the link in the email to verify your account and continue with your setup.
          </p>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">
              Didn't receive the email?
            </p>
            
            {resendMessage && (
              <div className={`p-3 rounded-md mb-3 ${
                resendMessage.includes('sent') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {resendMessage}
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <HiRefresh className="w-4 h-4 animate-spin" />
              ) : (
                <HiRefresh className="w-4 h-4" />
              )}
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>
            Check your spam folder if you don't see the email.
            <br />
            You can close this page after clicking the verification link.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}