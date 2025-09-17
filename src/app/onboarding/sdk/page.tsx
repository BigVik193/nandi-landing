'use client';

import { useState, useEffect } from 'react';
import SDKInstallation from '@/components/onboarding/SDKInstallation';

export default function SDKPage() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Load data from sessionStorage
    const data = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    setUserData(data);
  }, []);

  const handleNext = (data: any) => {
    // Store data in sessionStorage for persistence across pages
    const existingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    sessionStorage.setItem('onboardingData', JSON.stringify({ ...existingData, ...data }));
    window.location.href = '/onboarding/analytics';
  };

  const handleBack = () => {
    window.location.href = '/onboarding/project';
  };

  return (
    <>
      {/* Developer Override Buttons */}
      <div className="max-w-4xl mx-auto px-6 mb-4">
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800">🚧 Developer Override</span>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = '/onboarding/project'}
                className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => window.location.href = '/onboarding/analytics'}
                className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <SDKInstallation onNext={handleNext} onBack={handleBack} userData={userData} />
      </div>
    </>
  );
}