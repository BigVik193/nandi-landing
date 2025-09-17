'use client';

import WorkspaceCreation from '@/components/onboarding/WorkspaceCreation';

export default function WorkspacePage() {
  const handleNext = (data: any) => {
    // Store data in sessionStorage for persistence across pages
    const existingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    sessionStorage.setItem('onboardingData', JSON.stringify({ ...existingData, ...data }));
    window.location.href = '/onboarding/project';
  };

  const handleBack = () => {
    window.location.href = '/mobile-games';
  };

  return (
    <>
      {/* Header */}
      <div className="pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium font-title text-center mb-6">
            Get Started with Nandi
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-2xl mx-auto">
            Set up your dynamic in-game store in just a few simple steps
          </p>
        </div>
      </div>

      {/* Developer Override Buttons */}
      <div className="max-w-4xl mx-auto px-6 mb-4">
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800">🚧 Developer Override</span>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = '/mobile-games'}
                className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => window.location.href = '/onboarding/project'}
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
        <WorkspaceCreation onNext={handleNext} onBack={handleBack} />
      </div>
    </>
  );
}