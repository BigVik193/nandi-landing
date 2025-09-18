'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/mobile-games/MobileGamesNavigation';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const steps = [
  { id: 'workspace', name: 'Account', href: '/onboarding/workspace' },
  { id: 'project', name: 'Project', href: '/onboarding/project' },
  { id: 'sdk', name: 'SDK', href: '/onboarding/sdk' },
  { id: 'analytics', name: 'Analytics', href: '/onboarding/analytics' },
  { id: 'path-selection', name: 'Setup', href: '/onboarding/path-selection' }
];

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const path = window.location.pathname;
    const stepIndex = steps.findIndex(step => step.href === path);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  }, []);

  const handleSaveDraft = () => {
    const confirmed = window.confirm('Save your progress and return to the main site? You can continue your setup later.');
    if (confirmed) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${index <= currentStep 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`
                    ml-2 text-sm font-medium
                    ${index <= currentStep ? 'text-black' : 'text-gray-500'}
                  `}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-0.5 mx-4
                    ${index < currentStep ? 'bg-black' : 'bg-gray-200'}
                  `}></div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start items-center mt-6">
            <button
              onClick={handleSaveDraft}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              Save Draft & Exit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {children}
      </div>
    </div>
  );
}